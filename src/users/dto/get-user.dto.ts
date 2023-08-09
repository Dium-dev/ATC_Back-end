import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GetUserDto {

  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @IsEmail(undefined, { message: 'Invalid email format' })
    email:string;

  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @IsString({ message: 'El campo $property debe ser un texto' })
    password:string;
}