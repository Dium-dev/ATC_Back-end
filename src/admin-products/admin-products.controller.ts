import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AdminProductsService } from './admin-products.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SheetsProductDto } from './dto/sheetsProducts.dto';
import { IResponseCreateOrUpdateProducts } from './interfaces/response-create-update.interface';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guarg';
import { GetUser } from 'src/auth/decorators/auth-user.decorator';
import { IGetUser } from 'src/auth/interfaces/getUser.interface';
import { AuthAdminUser } from 'src/auth/decorators/auth-admin-user.decorator';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { IResponse } from 'src/utils/interfaces/response.interface';
import { CreateOneProductDto } from './dto/createOneProduct.dto';
import { DeleteProductImageDto } from './dto/deleteProductImage.dto';
import { IDestroyedImagesResponse } from 'src/products/interfaces/destroyedImages.interfaces';

@ApiTags('Admin Products')
@Controller('admin-products')
export class AdminProductsController {
  constructor(private readonly adminProductsService: AdminProductsService) {}

  @ApiOperation({
    description:
      "Mediante éste 'endPoint' es posible cargar / actualizar los productos de la base de datos",
  })
  @ApiResponse({
    status: 409,
    description:
      "No se ha encontrado el contenido de la URL solicitada '< url destino >'",
  })
  @ApiResponse({
    status: 500,
    description:
      'Hubo un problema al solicitar los datos a la URL: < URL destino >',
  })
  @ApiResponse({
    status: 409,
    description:
      'Hubo un problema a la hora de trabajár el Excel!. Recuerde ponerle un nombre a la hoja de trabajo',
  })
  @ApiResponse({
    status: 409,
    description:
      'Hubo un problema a la hora de trabajár el Excel!. confirme que la hoja de trabajo esté guardada',
  })
  @ApiResponse({
    status: 500,
    description:
      'Hubo un problema en el servidor al realizar la operación Excel => .csv',
  })
  @ApiResponse({
    status: 409,
    description:
      'No se pudo encontrar entre las entidades a < nombre del Producto >, en el Indice: < suma del index + 2 >',
  })
  @ApiResponse({
    status: 500,
    description:
      'Ocurrio un error al consultar la entidad < Nombre de la entidad trabajada (Category | Brand) >',
  })
  @ApiResponse({
    status: 500,
    description:
      'Ocurrió un problema en la creación del producto < nombre del Producto >, en el Indice: < suma del index + 2 >',
  })
  @ApiResponse({
    status: 500,
    description:
      'Ocurrio un error al Actualizar el producto < nombre del Producto >, en el Indice: < suma del index + 2 >',
  })
  @ApiResponse({
    status: 201,
    description: 'Productos creados / actualizados con éxito!',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
        },
      },
    },
  })
  /* post admin-products */
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  /* agreguar auth para usuarios admins a futuro ! */
  async excelToDataBase(
    @AuthAdminUser() _user: void,
    @Body('url') url: string,
  ): Promise<IResponseCreateOrUpdateProducts> {
    const sheetsData: GoogleSpreadsheet =
      await this.adminProductsService.getSheetsData(url);

    const jsonData: any = await this.adminProductsService.spreadSheetsToJSON(
      sheetsData,
    );

    const response: IResponseCreateOrUpdateProducts =
      await this.adminProductsService.JsonToDatabase(jsonData);
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @HttpCode(200)
  async updateOneProduct(
    @AuthAdminUser() _user: void,
    @Body() product: UpdateProductDto,
  ): Promise<IResponse> {
    await this.adminProductsService.updateOneProduct(product.id, product);
    return {
      statusCode: 200,
      message: 'Producto actualizado!',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('product-image')
  @HttpCode(200)
  async deleteProductImage(
    @AuthAdminUser() _user: void,
    @Body() productData: DeleteProductImageDto[],
  ): Promise<IDestroyedImagesResponse> {
    return await this.adminProductsService.DeleteImages(productData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('one')
  @HttpCode(201)
  async postOneProduct(
    @AuthAdminUser() _user: void,
    @Body() product: CreateOneProductDto,
  ): Promise<IResponse> {
    await this.adminProductsService.postOneProduct(product);
    return {
      statusCode: 201,
      message: 'Producto creado!',
    };
  }
}
