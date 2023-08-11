import { Injectable } from '@nestjs/common';
import { CreateDireetionDto } from './dto/create-direetion.dto';
import { UpdateDireetionDto } from './dto/update-direetion.dto';
import { Direction } from './entities/direction.entity';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class DireetionsService {
  async create(createDireetionDto: CreateDireetionDto) {
    try {
      const newDirection = await Direction.create({
        codigoPostal: createDireetionDto.codigoPostal,
        ciudad: createDireetionDto.ciudad,
        estado: createDireetionDto.estado,
        calle: createDireetionDto.calle,
        userId: createDireetionDto.userId,
      });

      if (!newDirection) {
        throw new BadRequestException();
      } else {
        return {
          statusCode: 201,
          newDirection,
        }
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException('No se puede crear direccion');
      } else {
        throw new InternalServerErrorException('Error del servidor');
      }
    }
  }

  findAll() {
    return 'This action returns all direetions';
  }

  findOne(id: number) {
    return `This action returns a #${id} direetion`;
  }

  async update(id: string, updateDireetionDto: UpdateDireetionDto) {
    try {
      const direction = await Direction.findByPk(id);

      if (direction) {
        if (updateDireetionDto.codigoPostal) {
          direction.codigoPostal = updateDireetionDto.codigoPostal;
        }

        if (updateDireetionDto.ciudad) {
          direction.ciudad = updateDireetionDto.ciudad;
        }

        if (updateDireetionDto.estado) {
          direction.estado = updateDireetionDto.estado;
        }

        if (updateDireetionDto.calle) {
          direction.calle = updateDireetionDto.calle;
        }

        await direction.save();

        return {
          statusCode: 200,
          direction,
        }
      } else {
        throw new NotFoundException('direccion no encontrada');
      }
    } catch (error) {

      if (error instanceof NotFoundException) {
        throw new NotFoundException('direccion no encontrada');
      } else {
        throw new InternalServerErrorException('Error del servidor');
      }
      
    }
  }

  async remove(id: string) {
    try {
      const direction = await Direction.findByPk(id);

      if (direction) {
        await direction.destroy();
        return { message: 'Direccion eliminada exitosamente' };
      } else {
        throw new Error('Direccion no encontrada');
      }
    } catch (error) {
      throw error;
    }
  }
}
