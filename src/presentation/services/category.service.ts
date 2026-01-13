import { CategoryModel } from "../../data";
import {
  CreateCategoryDto,
  CustomError,
  PaginationDto,
  UserEntity,
} from "../../domain";

export class CategoryService {
  // DI
  constructor() {}

  async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity) {
    // Verificar si la categoria ya existe
    const categoryExists = await CategoryModel.findOne({
      name: createCategoryDto.name,
    });

    // Si existe, lanzar un error
    if (categoryExists) {
      throw CustomError.badRequest("Category already exists");
    }

    try {
      const category = new CategoryModel({
        ...createCategoryDto,
        user: user.id,
      });

      await category.save();

      // Rettornar la categoria creada en el formato JSON esperado
      return {
        id: category.id,
        name: category.name,
        available: category.available,
      };
    } catch (error) {
      throw CustomError.internalServerError(`${error}`);
    }
  }

  async getCategories(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      // const total = await CategoryModel.countDocuments();
      // const categories = await CategoryModel.find()
      //   .skip((page - 1) * limit)
      //   .limit(limit);

      const [total, categories] = await Promise.all([
        CategoryModel.countDocuments(),
        CategoryModel.find()
          .skip((page - 1) * limit)
          .limit(limit),
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        categories: categories.map((category) => {
          return {
            id: category.id,
            name: category.name,
            available: category.available,
          };
        }),
      };
    } catch (error) {
      throw CustomError.internalServerError(`${error}`);
    }
  }
}
