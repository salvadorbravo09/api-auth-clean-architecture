import { CustomError } from "../errors/custom.error";

// Representa como se modelo un usuario en el dominio
export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly emailValidated: boolean,
    public readonly password: string,
    public readonly role: string[],
    public readonly img?: string
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const { id, _id, name, email, emailValidated, password, role, img } =
      object;

    if (!_id && !id) {
      throw CustomError.badRequest("User id is required");
    }

    if (!name) throw CustomError.badRequest("User name is required");
    if (!email) throw CustomError.badRequest("User email is required");
    if (emailValidated === undefined)
      throw CustomError.badRequest("User emailValidated is required");
    if (!password) throw CustomError.badRequest("User password is required");
    if (!role) throw CustomError.badRequest("User role is required");

    return new UserEntity(
      _id || id,
      name,
      email,
      emailValidated,
      password,
      role,
      img
    );
  }
}
