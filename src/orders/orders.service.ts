import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Op } from 'sequelize';

@Injectable()
export class OrdersService {
  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all orders`;
  }

  async findOne(id: string) {

    try {
      const orders = await Order.findAll({
        where: {
          userId: {
            [Op.eq]: id,
          },
        },
      });

      if (orders) {
        return {
          statusCode: 200,
          orders,
        };
      } else {
        throw new NotFoundException(
          'no hay ordenes para el usuario solicitado',
        );
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          'no hay ordenes para el usuario solicitado',
        );
      } else {
        throw new InternalServerErrorException('Error del servidor');
      }
    }
    
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
