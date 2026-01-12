import { regularExps } from "../../../config";

export class LoginUserDto {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}

  // error, dto
  static login(object: { [key: string]: any }): [string?, LoginUserDto?] {
    const { email, password } = object;

    if (!email) return ["Email is required", undefined];

    if (!regularExps.email.test(email))
      return ["Email is not valid", undefined];
    
    if (!password) return ["Password is required", undefined];

    return [undefined, new LoginUserDto(email, password)];
  }
}
