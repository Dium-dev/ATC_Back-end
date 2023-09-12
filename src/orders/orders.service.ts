import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStateEnum } from './entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { OrderProduct } from './entities/orderProduct.entity';

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

  async create(total:number, userId:string, productsId: string[]) {
    try {
      const newOrder = await Order.create({
        total: total,
        state: OrderStateEnum.PENDIENTE,
        userId: userId,
       
      });

      if (!newOrder) {
        throw new BadRequestException();
      } else {

        const products = await Product.findAll({
          where: {
            id: productsId,
          },
        });
    
        for (const product of products) {
          await OrderProduct.create({
            orderId: newOrder.id,
            productId: product.id,
          });
        }
        return {
          statusCode: 201,
          Order: newOrder,
        };
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException('No se puede crear orden');
      } else {
        throw new InternalServerErrorException('Error del servidor');
      }
    }
    
  }
}
