import { envs } from "./../../config/envs";
import { Router } from "express";
import { AuthController } from "./controller";
import { AuthService, EmailService } from "../services";
import { LimiterConfig } from "../../config/limiter";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY
    );
    const authService = new AuthService(emailService);
    const authController = new AuthController(authService);

    // Definir las rutas
    router.post("/login", LimiterConfig.authLimiter, authController.login);
    router.post("/register", LimiterConfig.authLimiter, authController.register);
    router.get("/validate-email/:token", authController.validateEmail);

    return router;
  }
}
