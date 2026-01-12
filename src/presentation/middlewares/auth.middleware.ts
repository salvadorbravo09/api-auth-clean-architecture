import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";

export class AuthMiddleware {
  static async validateJWT(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header("Authorization"); // Token que viene en los headers

    if (!authorization) {
      return res.status(401).json({ error: "No token provided" });
    }

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    // Bearer <token>
    // Extraemos el token después de "Bearer "
    const token = authorization.split(" ").at(1) || "";

    try {
      const payload = await JwtAdapter.verifyToken<{ id: string }>(token);

      if (!payload) {
        return res.status(401).json({ error: "Invalid token" });
      }

      const user = await UserModel.findById(payload.id);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      req.body.user = UserEntity.fromObject(user);
      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  }
}
