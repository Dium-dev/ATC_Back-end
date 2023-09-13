import { InternalServerErrorException, NotFoundException, HttpException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class OrdersService {

  async findOneOrder(id: string) {

    try {
      const order = await Order.findOne({
        where:{
          id: id,
        },
        attributes:['id', 'total', 'state'],
        include:{
          model: Product,
          attributes:['title', 'price', 'image', 'model', 'year'],
          through:{
            attributes:['amount', 'price'],
          },
        },
      });

      if (order) {
        return {
          statusCode: 200,
          order,
        };
      } else {
        throw new NotFoundException(
          'Orden no encontrada',
        );
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          'Orden no encontrada',
        );
      } else {
        throw new InternalServerErrorException('Error del servidor');
      }
    }

  }

  async findAllOrders(): Promise<CreateOrderDto[]> {
    try {
      return await Order.findAll();
    } catch (error) {
      throw new HttpException('Error al buscar todas las ordenes', 400);
    }
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
