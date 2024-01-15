import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ConsultationReason } from '../interfaces/update-order-context.interface';

export class UpdateOrderDto {
  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @ApiProperty({
    description: 'Recibe el nro de orden',
  })
  order: string;

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

  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @ApiProperty({
    description: 'Motivo de la consulta',
    enum: ['Envio', 'Producto', 'Pago', 'Otro'],
    example: 'Envio', // Proporciona un ejemplo aquí
  })
  @IsDefined({ message: 'El campo $property debe estar definido' })
  consultationReason: ConsultationReason;
}

export class UpdateOrderDtoSwagger extends UpdateOrderDto {}
