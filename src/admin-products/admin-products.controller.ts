import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { AdminProductsService } from './admin-products.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExcelProductDto } from './dto/exelProducts.dto';
import { IResponseCreateOrUpdateProducts } from './interfaces/response-create-update.interface';

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
  @Post('')
  @HttpCode(201)
  /* agreguar auth para usuarios admins a futuro ! */
  async excelToDataBase(
    @Body('url') url: string,
  ): Promise<IResponseCreateOrUpdateProducts> {
    /* Se usa la url al archivo excel para generar un buffer, luego a 
    formato csv y por último formato json para para aprovechar la data */
    const excelData: Buffer = await this.adminProductsService.getExcelData(url);

    const csvData: string = this.adminProductsService.excelToCsv(excelData);

    const jsonData: ExcelProductDto[] =
      await this.adminProductsService.csvToJson(csvData);

    const response: IResponseCreateOrUpdateProducts =
      await this.adminProductsService.JsonToDatabase(jsonData);
    return response;
  }
}
