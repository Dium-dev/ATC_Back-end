import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateDireetionDto } from './dto/create-direetion.dto';
import { UpdateDireetionDto } from './dto/update-direetion.dto';
import { Direction } from './entities/direction.entity';
import { IDirections, IResDirection } from './interfaces/direction.interface';
import { Op } from 'sequelize';
import { IResponse } from 'src/utils/interfaces/response.interface';

@Injectable()
export class DireetionsService {
  async create(createDireetionDto: CreateDireetionDto): Promise<IResDirection> {
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
          direction: newDirection,
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

  async findAll(id: string): Promise<IDirections> {
    try {
      const directions = await Direction.findAll({
        where: {
          userId: {
            [Op.eq]: id,
          },
        },
      });

      if (directions) {
        return {
          statusCode: 200,
          directions,
        };
      } else {
        throw new NotFoundException(
          'no hay direcciones para el usuario solicitado',
        );
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          'no hay direcciones para el usuario solicitado',
        );
      } else {
        throw new InternalServerErrorException('Error del servidor');
      }
    }
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

  async remove(id: string): Promise<IResponse> {
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
