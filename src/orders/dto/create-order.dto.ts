import {
  ArrayMinSize,
  IsArray,
  IsInstance,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { AmountPricePerProduct } from './amount-price-product';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsNumber(
    {},
    {
      message: '$property debe ser un número, en cambio enviaste: $value',
    },
  )
  @IsNotEmpty({
    message: '$property no puede estar vacío',
  })
    total: number;

  @IsArray({
    message: '$property debe ser un array válido',
  })
  @ArrayMinSize(1, {
    message: '$property no puede ser un array vacío',
  })
  @ValidateNested({
    each: true,
  })
  @Type(() => AmountPricePerProduct)
    products: AmountPricePerProduct[];
}
