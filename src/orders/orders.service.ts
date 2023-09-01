import { Injectable, NotFoundException,
  BadRequestException,
  InternalServerErrorException, } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStateEnum } from './entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { OrderProduct } from './entities/orderProduct.entity';

@Injectable()
export class OrdersService {
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

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
