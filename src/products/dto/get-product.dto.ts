import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsEnum,
  IsString,
} from 'class-validator';

export enum OrderType {
  Asc = 'ASC',
  Desc = 'DESC',
}

export enum ActiveType{
    active = 'Activa',
    inactive = 'Inactiva'
}

export class GetProductDto {
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
  @IsEnum(ActiveType)
  active?: ActiveType;
}
