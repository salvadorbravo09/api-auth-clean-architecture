import type { Request, Response } from "express";
import { CreateCategoryDto, CustomError } from "../../domain";

export class CategoryController {
  // DI
  constructor() {}

  // Manejo de errores centralizado
  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  };

  createCategory = async (req: Request, res: Response) => {
    const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
    if (error) {
      return res.status(400).json({ error });
    }

    return res.json(createCategoryDto)
  };

  getCategories = async (req: Request, res: Response) => {
    res.json("obtener categorias");
  };
}
