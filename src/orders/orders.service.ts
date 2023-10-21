import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Order, OrderStateEnum } from './entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { OrderProduct } from './entities/orderProduct.entity';
import { IGetOrders, IOrder } from './interfaces/response-order.interface';
import { GetAllOrdersDto } from './dto/getAllOrders.dto';
import { Op } from 'sequelize';
import { ShoppingCart } from 'src/shopping-cart/entities/shopping-cart.entity';
import { User } from 'src/users/entities/user.entity';
import { ShoppingCartService } from 'src/shopping-cart/shopping-cart.service';
import { PaymentsService } from 'src/payments/payments.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly shoppingCartService: ShoppingCartService,
    private readonly paymentsService: PaymentsService,
  ) {}

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
          data: order,
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

  //Obtener todas las órdenes de un usuario en particular
  async findAllByUser(id: string): Promise<IOrder> {
    try {
      const orders = await Order.findAll({
        where: {
          userId: id,
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
      if (!orders)
        throw new InternalServerErrorException(
          'Algo salió mal al momento de buscar las órdenes. Revisar id enviado',
        );
      if (!orders.length)
        throw new NotFoundException(
          'No se encontraron órdenes asociadas a este usuario',
        );
      return {
        statusCode: 200,
        data: orders,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  //Crear Orden
  async create(userId: string): Promise<object> {
    //Obtenemos el id del carrito del usuario que realiza la peticion
    const { cart } = await User.findByPk(userId, {
      include: [
        {
          model: ShoppingCart,
        },
      ],
    });
    //Aqui obtenemos el monto total y los productos para realizar la orden
    const { total, products } = await this.shoppingCartService.getCartProducts(
      cart.id,
    );

    try {
      const newOrder = await Order.create({
        total,
        userId: userId,
      });

      if (!newOrder) {
        throw new InternalServerErrorException('Algo salió mal en el servidor');
      } else {
        for (const product of products) {
          await OrderProduct.create({
            orderId: newOrder.id,
            productId: product.id,
            price: product.price,
            amount: product.amount,
          });
        }

        const urlBuy = await this.paymentsService.createPayment(
          total,
          userId,
          newOrder.id,
        );

        return {
          statusCode: 201,
          data: `Nueva orden creada exitosamente con el id ${newOrder.id}`,
          url: urlBuy,
        };
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll(getAllOrdersDto: GetAllOrdersDto): Promise<IGetOrders> {
    try {
      const { page, status } = getAllOrdersDto;
      //Preparing requirements for querying data using the method findAndCountAll
      const { limit, offset, order, attributes } =
        this.generateObject(getAllOrdersDto);

      //Querying
      const { rows: orders, count: totalOrders } = await Order.findAndCountAll({
        limit,
        offset,
        order,
        attributes,
        where: {
          state: {
            [Op.or]: status,
          },
        },
      });

      if (!orders.length)
        throw new NotFoundException('No se encontraron órdenes en esta página');

      const totalPages = Math.ceil(totalOrders / limit);

      return {
        statusCode: 200,
        data: { orders, totalOrders, totalPages, page },
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  //Method used to prepare query data
  generateObject(getAllOrders: GetAllOrdersDto) {
    //Returns an array of type:['created_at','ASC']
    const newOrder = getAllOrders.order.split(' ');
    const queryObject = {
      limit: getAllOrders.limit,
      offset: (getAllOrders.page - 1) * getAllOrders.limit,
      order: [],
      attributes: ['id', 'state', 'created_at'],
    };

    queryObject.order.push([newOrder[0], newOrder[1]]);

    return queryObject;
  }
}
