import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Aqui es donde iria la suma a pagar',
    example: 2000,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Aqui es donde iria el id de la orden',
  })
  @IsString()
  orderId: string;
}
