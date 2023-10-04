import { ArrayContains, ArrayMaxSize, ArrayMinSize, IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { OrderStateEnum } from '../entities/order.entity';


export enum DateOrder {
  Latest = 'created_at DESC',
  Oldest = 'created_at ASC',
}

//Pautas para el filtrado de las órdenes
export class GetAllOrdersDto {

  @IsNotEmpty({
    message: '$property no debe estar vacío',
  })
  @IsPositive({
    message:'$property debe ser un número mayor que cero',
  })
  //Número de órdenes por página
    limit:number;

  @IsNotEmpty({
    message: '$property no debe estar vacío',
  })
  @IsPositive({
    message:'$property debe ser un número mayor que cero',
  })
  //Según el limit, la página de las órdenes
    page:number;

  @IsNotEmpty({
    message: '$property no debe estar vacío',
  })
  @ArrayMinSize(1, {
    message: '$property debe ser un array de al menos $constraint1 elemento',
  })
  @ArrayMaxSize(4, {
    message:'$property no debe tener más de $constraint1 elementos',
  })
  //@ArrayContains(Object.values(OrderStateEnum))
  @IsEnum(OrderStateEnum, {
    message:
      'Hay un número limitado de valores permitidos para $property y $value no lo es',
    each:true,
  })
  //El estado actual de la orden
    status:string[];

  @IsNotEmpty({
    message: '$property no debe estar vacío',
  })
  @IsEnum(DateOrder, {
    message:
      'Hay un número limitado de valores permitidos para $property y $value no lo es',
  })
  //El orden en el que se envían las órdenes
    order:DateOrder;
}