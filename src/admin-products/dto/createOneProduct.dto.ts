import {
  ConditionProduct,
  StateProduct,
} from 'src/products/entities/product.entity';
import { IProduct } from '../interfaces/updateDataProduct.interface';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateOneProductDto implements IProduct {
  @IsNotEmpty({ message: 'La propiedad $property no debe ser nula' })
  @IsString({
    message:
      'La propiedad $property debe ser una string que contenga el ID del producto',
  })
  id: string;

  @IsNotEmpty({ message: 'La propiedad $property no debe ser nula' })
  @IsString({
    message:
      'La propiedad $property debe ser una string que contenga el titulo del producto',
  })
  title: string;

  @IsNotEmpty({ message: 'La propiedad $property no debe ser nula' })
  @IsString({
    message:
      'La propiedad $property debe ser una string que contenga la descripción del producto',
  })
  description: string;

  @IsNotEmpty({ message: 'La propiedad $property no debe ser nula' })
  @IsEnum(StateProduct, {
    message: `La propiedad $property solo puede ser completada con: ${Object.values(
      StateProduct,
    )}`,
  })
  state: StateProduct;

  @IsNotEmpty({ message: 'La propiedad $property no debe ser nula' })
  @IsEnum(ConditionProduct, {
    message: `La propiedad $property solo puede ser completada con: ${Object.values(
      ConditionProduct,
    )}`,
  })
  condition: ConditionProduct;

  @IsNotEmpty({ message: 'La propiedad $property no debe ser nula' })
  @IsNumber({}, { message: 'Debe contener el stock inicial del producto.' })
  stock: number;

  @IsNotEmpty({ message: 'La propiedad $property no debe ser nula' })
  @IsNumber({}, { message: 'Debe contener el precio del producto' })
  price: number;

  @IsNotEmpty({ message: 'La propiedad $property no debe ser nula' })
  @IsNumber({}, {})
  availability: number;

  @IsNotEmpty({ message: 'La propiedad $property no debe ser nula' })
  @IsBoolean()
  mostSelled: boolean;

  @IsNotEmpty({ message: 'La propiedad $property no debe ser nula' })
  @IsString({
    message:
      'La propiedad $property debe ser una string que contenga los links de las imagenes a poner sobre el porducto',
  })
  image: string;

  @IsNotEmpty({ message: 'La propiedad $property no debe ser nula' })
  @IsString({
    message:
      'La propiedad $property debe ser una string que contenga el modelo del producto',
  })
  model: string;

  @IsNotEmpty({ message: 'La propiedad $property no debe ser nula' })
  @IsString({
    message:
      'La propiedad $property debe ser una string que contenga el año del producto',
  })
  year: string;

  @IsNotEmpty({ message: 'La propiedad $property no debe ser nula' })
  @IsUUID('4', { message: 'La propiedad $property debe ser de tipo UUID V4' })
  categoryId: string;

  @IsNotEmpty({ message: 'La propiedad $property no debe ser nula' })
  @IsUUID('4', { message: 'La propiedad $property debe ser de tipo UUID V4' })
  brandId: string;
}
