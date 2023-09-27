import { Order } from '../entities/order.entity';

export interface IOrder {
<<<<<<< HEAD
  statusCode: number,
  data: Order | Order[] | string
}

export interface UpdateStateOrder {
  statusCode: number,
  message: string
}
=======
  statusCode: number;
  data: Order | Order[] | string;
}
>>>>>>> development
