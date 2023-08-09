import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail(undefined, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  email: string;

  @ApiProperty()
  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&]{8,15}/,
  )
  password: string;

  @ApiProperty()
  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  firstName: string;

  @ApiProperty()
  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  lastName: string;

  @ApiProperty()
  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  phone: string;
}
