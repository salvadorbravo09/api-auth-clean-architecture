import type { Request, Response } from "express";
import { CreateProductDto, CustomError, PaginationDto } from "../../domain";
import { ProductService } from "../services";
import { logger } from "../../config";

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Manejo de errores centralizado
  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    logger.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  };

  createProduct = async (req: Request, res: Response) => {
    const [error, createProductDto] = CreateProductDto.create({
      ...req.body,
      user: req.body.user.id,
    });

    if (error) {
      return res.status(400).json({ error });
    }

    this.productService
      .createProduct(createProductDto!)
      .then((product) => {
        logger.info({ product_id: product.id, user_id: req.body.user.id }, "Product created successfully");
        return res.status(201).json(product);
      })
      .catch((error) => this.handleError(error, res));
  };

  getProducts = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);

    if (error) {
      return res.status(400).json({ error });
    }

    this.productService
      .getProducts(paginationDto!)
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((error) => this.handleError(error, res));
  };
}
