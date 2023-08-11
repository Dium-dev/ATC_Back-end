import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail(undefined, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @ApiProperty({
    description:
      'Recibe el email del usuario y verifica si es el formato adecuado. Requerido',
  })
    email: string;

  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&]{8,15}/,
  )
  @ApiProperty({
    description:
      'Recie una contraseña que debe ser de 8 a 15 caracteres, tener una mayúscula, una minúscula, un número y un carácter especial. Requerido',
  })
    password: string;

  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @ApiProperty({
    description: 'Recive el nombre del usuario, requerido',
  })
    firstName: string;

  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @ApiProperty({
    description: 'Recive el apellido del usuario, requerido',
  })
    lastName: string;

  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @ApiProperty({
    description: 'Recive el telefono de contacto del usuario, requerido',
  })
    phone: string;
}
