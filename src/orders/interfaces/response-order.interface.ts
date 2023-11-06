import { IGetProducts } from 'src/products/interfaces/getProducts.interface';
import { Order } from '../entities/order.entity';

export interface IOrder {
  statusCode: number,
  data: Order | Order[] | string
}

export interface UpdateStateOrder {
  statusCode: number,
  message: string
}

export interface IGetOrders {
  statusCode: number;
  data: {
    orders: Order[];
    totalOrders: number;
    totalPages: number;
    page: number;
  };
}
