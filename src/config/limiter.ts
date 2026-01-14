import { rateLimit } from "express-rate-limit";

export class LimiterConfig {
  // Límite general para la API (Protección DDoS básica)
  static get globalLimiter() {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      limit: 100, // 100 peticiones por IP cada 15 min
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        error: "Too many requests from this IP, please try again later.",
      },
    });
  }

  // Límite estricto para Auth (Protección Fuerza Bruta)
  static get authLimiter() {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      limit: 5, // Solo 5 intentos de login/registro cada 15 min
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        error: "Too many login/register attempts, please try again after 15 minutes.",
      },
    });
  }
}
