import { ApiProperty } from '@nestjs/swagger';
<<<<<<< HEAD
import { IsNumber, IsString } from 'class-validator';
=======
import { IsNumber, IsEmail } from 'class-validator';
>>>>>>> 09cdee52d0cfdf9b7d88ef1f29cc5b8924848224

export class CreatePaymentDto {
  @ApiProperty({
    description:
      'Aqui es donde iria la suma a pagar',
    example: 2000,
  })
  @IsNumber()
    amount: number;

  @ApiProperty({
    description:
<<<<<<< HEAD
        'Aqui es donde iria el id de la orden',
  })
  @IsString()
    orderId: string;
=======
        'Email del usuario que va a realizar la compra',
    example: 'carlitos@gmail.com',
  })
  @IsEmail()
    email: string;
>>>>>>> 09cdee52d0cfdf9b7d88ef1f29cc5b8924848224
}
