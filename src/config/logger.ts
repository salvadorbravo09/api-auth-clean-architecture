import { ServerResponse } from "http";
import { IncomingMessage } from "http";
import { pinoHttp } from "pino-http";
import { randomUUID } from "crypto";
import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

// Instancia principal de Pino. Para logs generales que NO son peticiones HTTP
// Ejem: Base de datos conectada, Servidor inicio en el puerto ****
export const logger = pino({
  level: isProduction ? "info" : "debug", // Nivel de detalle
  transport: !isProduction
    ? {
        target: "pino-pretty", // Habilita colores solo si NO es producción
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,
});

// Middleware de Pino para interceptar peticiones que llega a la API
export const requestLogger = pinoHttp({
  logger, // Usa la misma configuracion base de logger

  // Generar ID único para cada petición
  genReqId: (req) => (req.headers["x-request-id"] as string) || randomUUID(),
  
  level: isProduction ? "info" : "debug", // Nivel de detalle

  // Serializadores: Limpian los objetos req/res/err para no loguear basura
  serializers: {
    req: (req: any) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      query: req.query,
      params: req.params,
    }),
    res: (res: any) => ({
      statusCode: res.statusCode,
    }),
  },

  // Custom Props: Añadir info extra a cada log
  customProps: (req: IncomingMessage, res: ServerResponse) => ({
    context: "HTTP",
  }),

  // Redacción de datos sensibles
  // Oculta passwords o tokens automáticamente si aparecen en el body/headers
  redact: {
    paths: ["req.headers.authorization", "req.body.password", "req.body.email"],
    remove: true,
  },
});
