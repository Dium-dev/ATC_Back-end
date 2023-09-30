import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

//Debe ser una clase para poder hacer las validaciones con class-validator
export class AmountPricePerProduct {
  @IsNotEmpty({
    message: '$property no puede estar vacío',
  })
  @IsString({
    message: '$property debe ser un UUID válido y registrado',
  })
  @Length(12, 12)
<<<<<<< HEAD
    id: string;
=======
    productId: string;
>>>>>>> 09cdee52d0cfdf9b7d88ef1f29cc5b8924848224

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
