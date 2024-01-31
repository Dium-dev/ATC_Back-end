import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Query,
  HttpCode,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { QueryProductsDto } from './dto/query-product.dto';
import { IGetProducts } from './interfaces/getProducts.interface';
import { ApiParam, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { IProductXcategory } from './interfaces/product-x-category.interface';
import { IGetOneProduct } from './interfaces/getProduct.interface';
import { IResponse } from 'src/utils/interfaces/response.interface';
import { GetUser } from 'src/auth/decorators/auth-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guarg';
import { IGetUser } from 'src/auth/interfaces/getUser.interface';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({
    summary: 'Obtener productos',
  })
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
  ): Promise<IProductXcategory> {
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
  async findOne(@Param('id') id: string): Promise<IGetOneProduct> {
    return this.productsService.findOne(id);
  }

  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiResponse({
    status: 204,
    description: 'Producto eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 500, description: 'Error del servidor' })
  @ApiParam({
    name: 'id',
    description: 'id del producto a eliminar',
    type: 'string',
  })
  /* Hacer ajuste para que solo x tipo de rol pueda modificar */
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<IResponse> {
    const response = await this.productsService.remove(id);
    return response;
  }

  // @UseGuards(JwtAuthGuard)
  @Patch('mostSelled/:id')
  async updateMostSell(
    // @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<IResponse> {
    try {
      // if (user.rol != Rol.admin) throw new HttpException('Forbidden resources.', 204);
      const response = await this.productsService.updateMostSell(id);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'agrear un producto a favoritos o eliminarlo' })
  @ApiResponse({
    status: 201,
    description: 'Producto agregado a favoritos',
  })
  @ApiParam({
    name: 'id',
    description: 'id del producto a agregar',
    type: 'string',
  })
  @Post('/fav/:productId')
  async favProduct(
    @GetUser() { userId }: IGetUser,
    @Param('productId') productId: string,
  ) {
    const response = await this.productsService.favOrUnfavProduct(
      userId,
      productId,
    );
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get('fav/all')
  async getProductsFav(
    @GetUser() { userId }: IGetUser,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const response = await this.productsService.getProductsFav(userId, {
      limit,
      page,
    });
    return response;
  }
}
