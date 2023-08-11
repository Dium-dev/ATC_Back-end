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
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

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
  async create(@Body() createDireetionDto: CreateDireetionDto) {
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

  @Patch(':id')
  async update(
  @Param('id') id: string,
    @Body() updateDireetionDto: UpdateDireetionDto,
  ) {
    return this.direetionsService.update(id, updateDireetionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.direetionsService.remove(id);
  }
}
