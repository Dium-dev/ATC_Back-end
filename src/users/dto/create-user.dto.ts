import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';


export class CreateUserDto {

  @ApiProperty()
  @IsEmail(undefined, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
    email: string;

  @ApiProperty()
  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
    password: string;

  @ApiProperty()
  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
    firtsName: string;

  @ApiProperty()
  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
    lastName: string;

  @ApiProperty()
  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
    phone: string;

}
