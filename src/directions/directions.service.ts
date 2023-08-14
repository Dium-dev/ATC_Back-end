import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateDireetionDto } from './dto/create-direetion.dto';
import { UpdateDireetionDto } from './dto/update-direetion.dto';
import { Direction } from './entities/direction.entity';
import { IDirection } from './interfaces/direction.interface';

@Injectable()
export class DireetionsService {
  async create(
    createDireetionDto: CreateDireetionDto,
  ): Promise<{ statusCode: number; newDirection: IDirection }> {
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
        };
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

  async update(
    id: string,
    updateDireetionDto: UpdateDireetionDto,
  ): Promise<{ statusCode: number; direction: IDirection }> {

    try {
      const thisDirection = await Direction.findByPk(id);

      if (thisDirection) {
        if (updateDireetionDto.codigoPostal) {
          thisDirection.codigoPostal = updateDireetionDto.codigoPostal;
        }

        if (updateDireetionDto.ciudad) {
          thisDirection.ciudad = updateDireetionDto.ciudad;
        }

        if (updateDireetionDto.estado) {
          thisDirection.estado = updateDireetionDto.estado;
        }

        if (updateDireetionDto.calle) {
          thisDirection.calle = updateDireetionDto.calle;
        }

        await thisDirection.save();

        return {
          statusCode: 200,
          direction: thisDirection,
        };
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
      const toRemoveDirection = await Direction.findByPk(id);

      if (toRemoveDirection) {
        await toRemoveDirection.destroy();
        return {
          statusCode: 204,
          message: 'Direccion eliminada exitosamente',
        };
      } else {
        throw new NotFoundException('Direccion no encontrada');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Direccion no encontrada');
      } else {
        throw new InternalServerErrorException('Error del servidor');
      }
    }
  }
}
