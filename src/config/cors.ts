import cors from "cors";

export class CorsConfig {
  static get corsOptions() {
    return cors({
      origin: "*", // permitir todas las fuentes, en producción especificar dominios permitidos
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // métodos permitidos
      allowedHeaders: ["Content-Type", "Authorization"], // cabeceras permitidas
    });
  }
}
