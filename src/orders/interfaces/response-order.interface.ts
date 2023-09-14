import { Order } from '../entities/order.entity';

export interface IOrder {
  statusCode: number,
  data: Order | Order[] | string
}

export interface UpdateStateOrder {
  statusCode: number,
  message: string
}