import { OrderStateEnum } from '../entities/order.entity';


export enum DateOrder {
  Latest = 'Más recientes',
  Oldest = 'Más antiguas',
}

//Pautas para el filtrado de las órdenes
export class GetAllOrdersDto {

  //Número de órdenes por página
  limit:number;

  //Según el limit, la página de las órdenes
  page:number;

  status?:OrderStateEnum;

  //El orden en el que se envían las órdenes
  order?:DateOrder;
}