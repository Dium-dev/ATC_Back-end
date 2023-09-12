import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class OrdersService {
  async findOneOrder(id: string) {
    try {
      const order = await Order.findOne({
        where: {
          id: id,
        },
        attributes: ['id', 'total', 'state'],
        include: {
          model: Product,
          attributes: ['title', 'price', 'image', 'model', 'year'],
          through: {
            attributes: ['amount', 'price'],
          },
        },
      });

      if (order) {
        return {
          statusCode: 200,
          order,
        };
      } else {
        throw new NotFoundException('Orden no encontrada');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Orden no encontrada');
      } else {
        throw new InternalServerErrorException('Error del servidor');
      }
    }
  }
}
