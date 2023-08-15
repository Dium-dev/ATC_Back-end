import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DireetionsService } from './directions.service';
import { CreateDireetionDto } from './dto/create-direetion.dto';
import { UpdateDireetionDto } from './dto/update-direetion.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { IDirection } from './interfaces/direction.interface';
import { IError } from 'src/utils/interfaces/error.interface';

@ApiTags('Directions')
@Controller('direetions')
export class DireetionsController {
  constructor(private readonly direetionsService: DireetionsService) {}

  @ApiOperation({ summary: 'Crear una nueva dirección' })
  @ApiBody({ type: CreateDireetionDto })
  @ApiResponse({
    status: 201,
    description: 'La dirección ha sido creada exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Solicitud inválida' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @Post()
  async create(
    @Body() createDireetionDto: CreateDireetionDto,
  ): Promise<{ statusCode: number; newDirection: IDirection } | IError> {
    const response = await this.direetionsService.create(createDireetionDto);
    return response;
  }



  @ApiOperation({ summary: 'Obtener direcciones' })
  @ApiResponse({
    status: 200,
    description: 'Direcciones obtenidas',
  })
  @ApiResponse({ status: 404, description: 'Direcciones no encontradas' })
  @ApiResponse({ status: 500, description: 'Error del servidor' })
  @Get()
  async findAll(){
    return await this.direetionsService.findAll();
  }




  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.direetionsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Modificar una direccion' })
  @ApiBody({ type: UpdateDireetionDto })
  @ApiResponse({
    status: 200,
    description: 'La dirección ha sido modificada exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Solicitud inválida' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiParam({
    name: 'id',
    description: 'id de la dirección a modificar',
    type: 'string',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
      @Body() updateDireetionDto: UpdateDireetionDto,
  ): Promise<{ statusCode: number; direction: IDirection } | IError> {
    const response = await this.direetionsService.update(
      id,
      updateDireetionDto,
    );
    return response;
  }

  @ApiOperation({ summary: 'Eliminar una direccion' })
  @ApiResponse({
    status: 204,
    description: 'Direccion eliminada exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Direccion no encontrada' })
  @ApiResponse({ status: 500, description: 'Error del servidor' })
  @ApiParam({
    name: 'id',
    description: 'id de la dirección a eliminar',
    type: 'string',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const response = await this.direetionsService.remove(id);
    return response;
  }
}
