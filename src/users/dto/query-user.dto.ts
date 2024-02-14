import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum FilterType {
  nombre = 'firstName',
  apellido = 'lastName',
  email = 'email',
  telefono = 'phone',
}

export class QueryUsersDto {
  @IsNotEmpty({ message: 'El límite no puede estar vacío' })
  @IsString({
    message:
      'El límite debe ser un string que sea un número entero pasado por query',
  })
  @ApiProperty({ description: 'Límite de resultados', default: '12' })
  limit: string;

  @IsNotEmpty({ message: 'La página no puede estar vacía' })
  @IsString({
    message:
      'La página debe ser un string que sea un número entero pasado por query',
  })
  @ApiProperty({ description: 'Página de resultados', default: '1' })
  page: string;

  @IsOptional()
  @IsString({
    message:
      'Si desea que retorne de manera descendente active este parametro(true)',
  })
  @ApiProperty({
    name: 'desc',
    required: false,
    type: Boolean,
    description: 'Orden Descendente',
  })
  desc?: string;

  @IsOptional()
  @IsEnum(FilterType)
  @IsString({ message: 'Se debe enviar un atributo existente' })
  @ApiProperty({
    name: 'filter',
    required: false,
    enum: FilterType,
    description: 'Filtro',
  })
  filter?: FilterType;

  @ApiProperty({
    name: 'search',
    required: false,
    description: 'Valor de atributo a filtrar',
  })
  @IsOptional({ message: 'Se debe enviar el valor del atributo a filtrar' })
  @IsString()
  search?: string;
}
