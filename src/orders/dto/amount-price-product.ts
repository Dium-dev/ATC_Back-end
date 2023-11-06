import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

//Debe ser una clase para poder hacer las validaciones con class-validator
export class AmountPricePerProduct {
  @IsNotEmpty({
    message: '$property no puede estar vacío',
  })
  @IsString({
    message: '$property debe ser un UUID válido y registrado',
  })
  @Length(12, 12)
  id: string;

  @IsNumber(
    {},
    {
      message: '$property debe ser un número, en cambio enviaste: $value',
    },
  )
  @IsNotEmpty({
    message: '$property no puede estar vacío',
  })
  amount: number;

  @IsNumber(
    {},
    {
      message: '$property debe ser un número, en cambio enviaste: $value',
    },
  )
  @IsNotEmpty({
    message: '$property no puede estar vacío',
  })
  price: number;
}
