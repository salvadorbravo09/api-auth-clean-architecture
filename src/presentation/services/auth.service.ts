import { BcryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from "../../domain";
import { EmailService } from "./email.service";

export class AuthService {
  // DI
  constructor(private readonly emailService: EmailService) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    // Verifica si el email ya esta en uso
    const existingUser = await UserModel.findOne({
      email: registerUserDto.email,
    });

    if (existingUser) {
      throw CustomError.badRequest("Email is already in use");
    }

    try {
      // Crea una instancia del modelo de mongoose y guarda el usuario
      const user = new UserModel(registerUserDto);

      // Encriptar la password
      user.password = BcryptAdapter.hash(registerUserDto.password);

      await user.save();

      // enviar email de validacion
      await this.sendEmailValidationLink(user.email);

      // Excluye el password al retornar el usuario registrado
      const { password, ...userEntity } = UserEntity.fromObject(user);

      // generar token JWT
      const token = await JwtAdapter.generateToken({
        id: user.id,
      });

      return {
        user: {
          ...userEntity,
        },
        token: token!,
      };
    } catch (error) {
      throw CustomError.internalServerError(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    // verificar si el usuario existe
    const user = await UserModel.findOne({
      email: loginUserDto.email,
    });

    if (!user) {
      throw CustomError.unauthorized("Invalid credentials");
    }

    // comparar password
    const isMatching = BcryptAdapter.compare(
      loginUserDto.password,
      user.password
    );

    if (!isMatching) {
      throw CustomError.unauthorized("Email or password is incorrect");
    }

    // retornar user
    const { password, ...userEntity } = UserEntity.fromObject(user);

    // generar token JWT
    const token = await JwtAdapter.generateToken({
      id: user.id,
    });

    if (!token) {
      throw CustomError.internalServerError("Could not generate token");
    }

    return {
      user: {
        ...userEntity,
      },
      token: token!,
    };
  }

  private sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email });

    if (!token) {
      throw CustomError.internalServerError(
        "Could not generate email validation token"
      );
    }

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const html = `
      <h1>Validate your email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${link}">Validate your email: ${link}</a>
    `;

    const options = {
      to: email,
      subject: "Validate your email",
      htmlBody: html,
    };

    const emailSent = await this.emailService.sendEmail(options);
    if (!emailSent) {
      throw CustomError.internalServerError("Could not send validation email");
    }

    return true;
  };

  public validateEmail = async (token: string) => {
    const payload = await JwtAdapter.verifyToken(token);

    if (!payload) {
      throw CustomError.unauthorized("Invalid token");
    }

    const { email } = payload as { email: string };
    if (!email) {
      throw CustomError.internalServerError("Token payload is missing email");
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw CustomError.internalServerError("User not found");
    }

    user.emailValidated = true;
    await user.save();

    return true;
  };
}
