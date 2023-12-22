import {
  BadRequestException,
  Inject,
  forwardRef,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { QueryProductsDto } from './dto/query-product.dto';
import { FindOptions, Op } from 'sequelize';
import { Brand } from 'src/brands/entities/brand.entity';
import { Categories } from 'src/categories/entities/category.entity';
import { Product } from './entities/product.entity';
import { IQuery } from './interfaces/querys.interface';
import { IGetProducts } from './interfaces/getProducts.interface';
import {
  IItemsProducXcategory,
  IProductXcategory,
} from './interfaces/product-x-category.interface';
import { AdminProductsService } from 'src/admin-products/admin-products.service';
import { ExcelProductDto } from 'src/admin-products/dto/exelProducts.dto';
import { ShoppingCartService } from 'src/shopping-cart/shopping-cart.service';

/* temporal acá */
enum EModelsTable {
  findAll = 'findAll',
  findOne = 'findOne',
}
import { UserProductFav } from 'src/orders/entities/userProductFav.entity';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(forwardRef(() => AdminProductsService))
    private adminProductsService: AdminProductsService,
    @Inject(forwardRef(() => ShoppingCartService))
    private shoppingCartService: ShoppingCartService,
  ) {}

  async getQueryDB(query: QueryProductsDto): Promise<IQuery> {
    const limit = parseInt(query.limit);
    const page = parseInt(query.page);

    const querys = {
      limit,
      page,
      offset: (page - 1) * limit,
      order: [],
      whereProduct: { id: { [Op.not]: null } },
      whereCategoryId: { id: {} },
      whereBrandId: { id: {} },
    };

    if (query.name)
      // eslint-disable-next-line @typescript-eslint/dot-notation
      querys.whereProduct['title'] = { [Op.iLike]: `%${query.name}%` };
    // eslint-disable-next-line @typescript-eslint/dot-notation
    if (query.active) querys.whereProduct['state'] = query.active;
    if (query.order) {
      const thisOrder = query.order.split(' ');
      if (thisOrder[0] === 'NOMBRE') {
        querys.order.push(['title', thisOrder[1]]);
      }
      if (thisOrder[0] === 'PRECIO') {
        querys.order.push(['price', thisOrder[1]]);
      }
    }
    if (query.categoryId) {
      querys.whereCategoryId.id = { [Op.eq]: query.categoryId };
    } else {
      querys.whereCategoryId.id = { [Op.not]: null };
    }
    if (query.brandId) {
      querys.whereBrandId.id = { [Op.eq]: query.brandId };
    } else {
      querys.whereBrandId.id = { [Op.not]: null };
    }

    return querys;
  }

  async getProducts(querys: any): Promise<IGetProducts> {
    const {
      limit,
      offset,
      order,
      whereProduct,
      whereBrandId,
      whereCategoryId,
      page,
    } = querys;

    const { rows: items, count: totalItems } = await Product.findAndCountAll({
      limit,
      offset,
      order,
      attributes: [
        'id',
        'title',
        'state',
        'stock',
        'price',
        'mostSelled',
        'condition',
        'availability',
        'image',
        'model',
        'year',
      ],
      where: whereProduct,
      include: [
        { model: Brand, as: 'brand', where: whereBrandId },
        { model: Categories, as: 'category', where: whereCategoryId },
      ],
    });

    const totalPages = Math.ceil(totalItems / limit);

    return { items, totalItems, totalPages, page: Number(page) };
  }

  async existCategoty(categoryName: string): Promise<boolean> {
    try {
      const boleanCategory: number = await Categories.count({
        where: { name: { [Op.iLike]: `%${categoryName}%` } },
      });
      if (boleanCategory) return true;
      else throw new BadRequestException();
    } catch (error) {
      switch (error.constructor) {
        case BadRequestException:
          throw new BadRequestException(
            `No hay coincidencias de una categoría '${categoryName}' en nuestra base de datos`,
          );
        default:
          throw new InternalServerErrorException(
            'Hubo un problema en el servidor a la hora de consultar la categoría existente',
          );
      }
    }
  }

  async getProductsXCategory(categoryName: string): Promise<IProductXcategory> {
    try {
      const items: IItemsProducXcategory[] | [] = await Product.findAll({
        limit: 5,
        attributes: ['id', 'title', 'state', 'price', 'image'],
        include: [
          {
            model: Categories,
            where: { name: { [Op.iLike]: `%${categoryName}%` } },
          },
          { model: Brand },
        ],
      });
      if (items.length === 0) throw new BadRequestException();
      return {
        statusCode: 200,
        items,
      };
    } catch (error) {
      switch (error.constructor) {
        case BadRequestException:
          throw new BadRequestException(
            `No se encontraron coincidencias de productos con categoría '${categoryName}'`,
          );
        default:
          throw new InternalServerErrorException(
            'Hubo un problema en el servidor a la hora de consultar por los productos',
          );
      }
    }
  }

  async findOne(id: string) {
    try {
      const product = await Product.findByPk(id);

      if (product) {
        return {
          statusCode: 200,
          product,
        };
      } else {
        throw new NotFoundException('producto no encontrado');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('producto no encontrado');
      } else {
        throw new InternalServerErrorException('Error del servidor');
      }
    }
  }

  async remove(id: string) {
    try {
      const product = await Product.findByPk(id);

      if (product) {
        await product.destroy();
        return {
          statusCode: 204,
          message: 'Producto eliminado exitosamente',
        };
      } else {
        throw new NotFoundException('Producto no encontrado');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Producto no encontrado');
      } else {
        throw new InternalServerErrorException('Error del servidor');
      }
    }
  }
  /* Public functions a utilizar en diferentes modulos */

  public async genericProduct(method: EModelsTable, options: FindOptions) {
    try {
      const genericResponseProduct = await Product[method](options);
      if (!genericResponseProduct)
        throw new BadRequestException(
          `No se encontraron datos para la solucitud de tipo ${method}`,
        );
      return genericResponseProduct;
    } catch (error) {
      switch (error.constructor) {
        case BadRequestException:
          throw new BadRequestException(error.message);
        default:
          throw new InternalServerErrorException(
            `Ocurrio un error al trabajar la entidad usuario a la hora de indagar por ${method}`,
          );
      }
    }
  }

  public async findAndCountAllGenericProduct(options: FindOptions) {
    try {
      const genericResponseProduct = await Product.findAndCountAll(options);
      if (!genericResponseProduct)
        throw new BadRequestException(
          'No se encontraron datos para la solucitud de tipo findAndCountAll',
        );
      return genericResponseProduct;
    } catch (error) {
      switch (error.constructor) {
        case BadRequestException:
          throw new BadRequestException(error.message);
        default:
          throw new InternalServerErrorException(
            'Ocurrio un error al trabajar la entidad usuario a la hora de indagar por findAndCountAll',
          );
      }
    }
  }

  public async findByPkGenericProduct(productId: string, options: FindOptions) {
    try {
      const genericResponseProduct = await Product.findByPk(productId, options);
      if (!genericResponseProduct)
        throw new BadRequestException('No ha sido posible encontro al usuario');
      return genericResponseProduct;
    } catch (error) {
      switch (error.constructor) {
        case BadRequestException:
          throw new BadRequestException(error.message);
        default:
          throw new InternalServerErrorException(
            'Ocurrio un error al trabajar la entidad usuario a la hora de indagar por ususario particular',
          );
      }
    }
  }

  public async findByPkToValidateExistentProduct(
    productId: string,
    options: FindOptions,
  ): Promise<Product | null> {
    try {
      const genericResponseProduct: Product | null = await Product.findByPk(
        productId,
        options,
      );
      return genericResponseProduct;
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrio un error al trabajar la entidad Producto a la hora de indagar por producto particular',
      );
    }
  }

  public async createGenericProduct(
    product: ExcelProductDto,
    brandId: string,
    categoryId: string,
    index: number,
  ) {
    try {
      const genericCreatedProduct = await Product.create({
        id: product['Número de publicación'],
        title: product.Título,
        description: product.Descripción,
        state: product.Estado,
        stock: Number(product.Stock),
        price: Number(product['Precio COP']),
        condition: product.Condicion,
        availability: Number(product['Disponibilidad de stock (días)']) || 0,
        image: product.Fotos.split(','), // cambiar en caso de que las fotos esten separadas por un espacio " "
        year: product.Año,
        brandId,
        categoryId,
      });
      if (!genericCreatedProduct) throw new InternalServerErrorException();
      return;
    } catch (error) {
      throw new InternalServerErrorException(
        `Ocurrio un error al trabajar la entidad Producto a la hora de crear el producto ${
          product.Título
        } del indice ${index + 2}.\n ${error.message}`,
      );
    }
  }

  public async updateMostSell(id: string) {
    try {
      const product = await Product.findByPk(id);
      product.mostSelled = !product.mostSelled;
      await product.save();
      return {
        statusCode: 204,
        message: 'Producto actualizado exitosamente',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        "Ocurrio un error a la hora de actualizar la propiedad 'masVendido' del producto.",
      );
    }
  }

  async favOrUnfavProduct(userId: string, productId: string) {
    try {
      console.log(userId, productId);
      const [fav, created] = await UserProductFav.findOrCreate({ where: { userId, productId } });

      if (created) {
        return {
          statusCode: 201,
          message: 'El producto se ha agregado a favoritos',
        };
      } else {
        await fav.destroy();
        return {
          statusCode:201,
          message: 'El producto se ha eliminado',
        };
      }
    } catch (error) {
      throw new InternalServerErrorException('Error al agregar el producto a favoritos');
    }
  }


  async getProductsFav(userId: string, { limit, page }: any) {
    try {
      const { rows:allFavs, count: totalItems } = await UserProductFav.findAndCountAll({ where: { userId } });

      const totalPages = Math.ceil(totalItems / limit);
      const startIndex = page * limit;
      const paginatedFavs = allFavs.slice(startIndex, startIndex + limit);

      return { allFavs: paginatedFavs, totalItems, totalPages, page: Number(page) };
    } catch (error) {
      throw new InternalServerErrorException('Error del servidor');
    }
  }
}
