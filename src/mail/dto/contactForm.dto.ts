import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class ContactFormDto {
  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @ApiProperty({
    description: 'Recibe el nombre del usuario, requerido',
  })
    name: string;

  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @ApiProperty({
    description: 'Recibe el telefono de contacto del usuario, requerido',
  })
    phone: string;

  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @ApiProperty({
    description: 'Mensaje del usuario, requerido',
  })
    message: string;

  @IsEmail(undefined, { message: 'El formato del email no es valido' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @ApiProperty({
    description:
      'Recibe el email del usuario y verifica si es el formato adecuado. Requerido',
  })
    userEmail: string; // Agrega este campo para capturar el correo del usuario
}