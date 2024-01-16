import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { OrderStateEnum } from '../entities/order.entity';

export class UpdateOrderDto {
  @IsUUID(4, {
    message: '$property debe ser un uuid, en cambio enviaste: $value',
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
