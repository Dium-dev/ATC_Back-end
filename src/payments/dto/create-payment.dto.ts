import { IsNumber, IsString, IsEmail } from 'class-validator';

export class CreatePaymentDto {
    @IsNumber()
    amount: number;
  
    @IsEmail()
    email: string;
}
