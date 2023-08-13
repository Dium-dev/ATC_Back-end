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
import { direction} from './interfaces/direction.interface';
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
  async create(@Body() createDireetionDto: CreateDireetionDto): Promise<direction | IError> {

    return this.direetionsService.create(createDireetionDto);
  }

  @Get()
  findAll() {
    return this.direetionsService.findAll();
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
  ): Promise<direction | IError> {
    const response = await this.direetionsService.update(id, updateDireetionDto);
    return response

  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.direetionsService.remove(id);
  }
}
