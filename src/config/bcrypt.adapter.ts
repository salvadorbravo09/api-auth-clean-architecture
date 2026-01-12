import { compareSync, genSaltSync, hashSync } from "bcryptjs";

export class BcryptAdapter {
  static hash(password: string): string {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
  }

  static compare(password: string, hashedPassword: string) {
    return compareSync(password, hashedPassword);
  }
}
