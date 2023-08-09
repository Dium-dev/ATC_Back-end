import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsEnum,
  IsString,
} from 'class-validator';
import { stateproduct } from '../entities/product.entity';

export enum OrderType {
  nameAsc = 'NOMBRE ASC',
  nameDesc = 'NOMBRE DESC',
  priceAsc = 'PRECIO ASC',
  priceDesc = 'PRECIO DESC',
}

export class QueryProductsDto {
  @IsNotEmpty()
  @IsInt()
  limit: number;

  @IsNotEmpty()
  @IsInt()
  page: number;

  @IsOptional()
  @IsEnum(OrderType)
  order?: OrderType;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  brandId?: string;

  @IsOptional()
  @IsEnum(stateproduct)
  active?: stateproduct;
}
