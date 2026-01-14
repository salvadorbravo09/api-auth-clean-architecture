import { Request, Response } from "express";
import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";
import { logger } from "../../config";

export class AuthController {
  // DI
  constructor(private readonly authService: AuthService) {}

  // Manejo de errores centralizado
  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    logger.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  };

  register = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    this.authService
      .registerUser(registerUserDto!)
      .then((result) => {
        logger.info({ user_email: result.user.email }, "User registered successfully");
        return res.status(201).json(result);
      })
      .catch((error) => {
        return this.handleError(error, res);
      });
  };

  login = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.login(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    this.authService
      .loginUser(loginUserDto!)
      .then((result) => {
        logger.info({ user_email: result.user.email }, "User logged in successfully");
        return res.status(200).json(result);
      })
      .catch((error) => this.handleError(error, res));
  };

  validateEmail = (req: Request, res: Response) => {
    const { token } = req.params;

    this.authService
      .validateEmail(token)
      .then(() => {
        return res
          .status(200)
          .json({ message: "Email validated successfully" });
      })
      .catch((error) => {
        return this.handleError(error, res);
      });
  };
}
