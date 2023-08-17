import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-product.dto';
import { IGetProducts } from './interfaces/getProducts.interface';
import { ApiParam, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { IError } from 'src/utils/interfaces/error.interface';
import { IProductXcategory } from './interfaces/product-x-category.interface';
import { IProduct } from './interfaces/getProduct.interface';


@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(
    @Query() queryProducts: QueryProductsDto,
  ): Promise<IGetProducts> {
    const queryBD = await this.productsService.getQueryDB(queryProducts);
    const products = await this.productsService.getProducts(queryBD);
    return products;
  }

  @ApiOperation({
    summary:
      'Trae los primeros 5 productos coincidentes con la categoría indicada',
  })
  @ApiParam({
    name: 'categoryName',
    description:
      'Debe ser similar o igual al nombre de una categoría existente o incluir parte de la misma',
    examples: {
      'variante 1': {
        summary: 'variante 1 <literal>',
        description: 'Nombre literal de la categoria',
        value: 'Farolas',
      },
      'variante 2': {
        summary: 'variante 2 <alterado>',
        description: 'Nombre con variantes de la categoría',
        value: 'FaRolA',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description:
      "En caso de no haber error, la respuesta de la misma será un objeto con propiedades 'statusCode', 'items'",
  })
  @ApiResponse({
    status: 400,
    description:
      'No hay coincidencias de una categoría <nombre de la categoria buscada> en nuestra base de datos',
  })
  @ApiResponse({
    status: 400,
    description:
      'No se encontraron coincidencias de productos con categoría <nombre de la categoria por la que se filtró>',
  })
  @ApiResponse({
    status: 500,
    description:
      'Hubo un problema en el servidor a la hora de consultar la categoría existente',
  })
  @Get('principales/:categoryName')
  @HttpCode(200)
  async getProductsXCategory(
    @Param('categoryName') category: string,
  ): Promise<IProductXcategory | IError> {
    const thisData: IProductXcategory = await this.productsService
      .existCategoty(category)
      .then(async () => {
        const thisProducts: IProductXcategory =
          await this.productsService.getProductsXCategory(category);
        return thisProducts;
      });
    return thisData;
  }



  @ApiOperation({ summary: 'Obtener producto por id' })
  @ApiResponse({
    status: 200,
    description: 'Producto obtenido',
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 500, description: 'Error del servidor' })
  @ApiParam({
    name: 'id',
    description: 'id del producto que busco',
    type: 'string',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise < IProduct| IError> {
    return await this.productsService.findOne(id);
  }




}



