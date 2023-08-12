import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsEnum,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { stateproduct } from '../entities/product.entity';
import { IError } from 'src/utils/interfaces/error.interface';

export enum OrderType {
  nameAsc = 'NOMBRE ASC',
  nameDesc = 'NOMBRE DESC',
  priceAsc = 'PRECIO ASC',
  priceDesc = 'PRECIO DESC',
}

export class QueryProductsDto {
  @IsNotEmpty({ message: 'El límite no puede estar vacío' })
  @IsInt({ message: 'El límite debe ser un número entero' })
  @ApiProperty({ description: 'Límite de resultados' })
    limit: number;

  @IsNotEmpty({ message: 'La página no puede estar vacía' })
  @IsInt({ message: 'La página debe ser un número entero' })
  @ApiProperty({ description: 'Página de resultados' })
    page: number;

  @IsOptional()
  @IsEnum(OrderType, { message: 'Tipo de orden inválido' })
  @ApiProperty({ description: 'Tipo de orden', enum: OrderType })
    order?: OrderType;

  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @ApiProperty({ description: 'Nombre' })
    name?: string;

  @IsOptional()
  @IsString({ message: 'El ID de categoría debe ser una cadena de texto' })
  @ApiProperty({ description: 'ID de categoría' })
    categoryId?: string;

  @IsOptional()
  @IsString({ message: 'El ID de marca debe ser una cadena de texto' })
  @ApiProperty({ description: 'ID de marca' })
    brandId?: string;

  @IsOptional()
  @IsEnum(stateproduct, { message: 'Estado de producto inválido' })
  @ApiProperty({ description: 'Estado de producto', enum: stateproduct })
    active?: stateproduct;
}
