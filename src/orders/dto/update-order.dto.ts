import { IsNumber, IsNotEmpty, IsString } from 'class-validator';
import { OrderStateEnum } from '../entities/order.entity';

export class UpdateOrderDto {
  @IsNumber({}, {
    message: '$property debe ser número, en cambio enviaste: $value',
  })
  @IsNotEmpty({
    message: '$property no puede estar vacío',
  })
    idOrder: string;

  @IsString({
    message: '$property debe ser un string, en cambio enviaste: $value',
  })
  @IsNotEmpty({
    message: '$property no puede estar vacio',
  })
    OrderStateEnum: OrderStateEnum;
}
