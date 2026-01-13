import { Router } from "express";
import { ProductController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class ProductRoutes {
  static get routes(): Router {
    const router = Router();
    const productController = new ProductController();

    // Rutas
    router.get("/", productController.getProducts);
    router.post(
      "/",
      // [AuthMiddleware.validateJWT],
      productController.createProduct
    );

    return router;
  }
}
