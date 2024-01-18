import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
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
  userEmail: string;

  @IsNotEmpty({ message: 'La propiedad $property, no debe estar vacia' })
  @IsUUID('4', { message: 'La propiedad $property, debe ser un Id de tipo V4' })
  @ApiProperty({
    description: 'ID del usuario (opcional, para usuarios autenticados)',
    required: false,
  })
  userId: string;
}
