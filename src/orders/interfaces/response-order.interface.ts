import { IGetProducts } from 'src/products/interfaces/getProducts.interface';
import { Order } from '../entities/order.entity';
import { IResponse } from 'src/utils/interfaces/response.interface';

export interface IOrder {
  statusCode: number;
  data: Order | Order[] | string;
}

export interface UpdateStateOrder extends IResponse {}

export interface IGetOrders {
  statusCode: number;
  data: {
    orders: Order[];
    totalOrders: number;
    totalPages: number;
    page: number;
  };
}
