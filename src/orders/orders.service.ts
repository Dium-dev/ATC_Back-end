import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStateEnum } from './entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { OrderProduct } from './entities/orderProduct.entity';
import { IOrder } from './interfaces/response-order.interface';

@Injectable()
export class OrdersService {

  async findOneOrder(id: string):Promise<IOrder> {

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
          data: order,
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

  //Obtener todas las órdenes de un usuario en particular
  async findAllByUser(id: string):Promise<IOrder> {
    try {
      const orders = await Order.findAll({
        where:{
          userId: id,
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
      if (!orders) throw new InternalServerErrorException('Algo salió mal al momento de buscar las órdenes. Revisar id enviado');
      if (!orders.length) throw new NotFoundException('No se encontraron órdenes asociadas a este usuario');
      return {
        statusCode: 200,
        data: orders,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
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
