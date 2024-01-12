import {
  Inject,
  forwardRef,
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateDirectionDto } from './dto/create-direetion.dto';
import { UpdateDirectionDto } from './dto/update-direetion.dto';
import { Direction } from './entities/direction.entity';

import { IResDirection } from './interfaces/direction.interface';

import { Op } from 'sequelize';
import { IResponse } from 'src/utils/interfaces/response.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DirectionsService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async create(createDirectionDto: CreateDirectionDto): Promise<IResDirection> {
    try {
      const newDirection = await Direction.create(createDirectionDto);

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

  async findAll(id: string): Promise<IResDirection> {
    try {
      const direction = await Direction.findAll({
        where: {
          userId: {
            [Op.eq]: id,
          },
        },
      });

      if (direction.length) {
        return {
          statusCode: 200,
          direction,
        };
      } else {
        return {
          statusCode: 204,
          message: 'No tiene aun ninguna dirección subida.'
        }
      }
    } catch (error) {
      throw new InternalServerErrorException('Error del servidor a la hora de consultar las direcciones del ususario');
    }
  }

  async update({
    id,
    address,
    city,
    district,
    addressReference,
    userId,
  }: UpdateDirectionDto): Promise<IResDirection> {
    try {
      const thisDirection = await Direction.update(
        { address, city, district, addressReference },
        { where: { id, userId } },
      );
      if (thisDirection) {
        return {
          statusCode: 200,
          message: 'Se ha actualizado correctamente su dirección.',
        };
      } else {
        throw new NotFoundException('Dirección no encontrada');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException(
          'Ocurrió un error en el servidor al intentar actualizar su dirrección',
        );
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
