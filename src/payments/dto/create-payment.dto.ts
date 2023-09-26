import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsEmail } from 'class-validator';

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
        'Email del usuario que va a realizar la compra',
    example: 'carlitos@gmail.com',
  })
  @IsEmail()
    email: string;
}
