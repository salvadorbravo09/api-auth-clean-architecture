import { ProductModel } from "../../data";
import { CreateProductDto, CustomError, PaginationDto } from "../../domain";

export class ProductService {
  // DI
  constructor() {}

  async createProduct(createProductDto: CreateProductDto) {
    // Verificar si el producto ya existe
    const productExists = await ProductModel.findOne({
      name: createProductDto.name,
    });

    if (productExists) {
      throw CustomError.badRequest("Product with thid name already exists");
    }

    try {
      const product = new ProductModel(createProductDto);
      await product.save();

      return product;
    } catch (error) {
      throw CustomError.internalServerError(`${error}`);
    }
  }

  async getProducts(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [total, products] = await Promise.all([
        ProductModel.countDocuments(),
        ProductModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate("user")
          .populate("category"),
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        products: products,
      };
    } catch (error) {
      throw CustomError.internalServerError(`${error}`);
    }
  }
}
