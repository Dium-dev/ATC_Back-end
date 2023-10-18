import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Rating } from '../entities/review.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  //review
  @ApiProperty({
    description:
      'Lo que sería la reseña en sí, aquí va escrita la opinión del usuario. Debe tener entre 10 y 500 caracteres',
    example: 'Fua, excelente servicio',
  })
  @IsString({
    message: '$property debe ser un string',
  })
  @IsNotEmpty({
    message: '$property no debe estar vacío',
  })
  @MinLength(10, {
    message:
      '$property is too short, minumum length must be $constraint1, but actual is $value',
  })
  @MaxLength(500, {
    message:
      '$property is too long, maximum length must be $constraint1, but actual is $value',
  })
    review: string;

  //rating
  @ApiProperty({
    enum: ['0', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'],
    description:
      'Valor númerico de que solo admite cierto valores según un enum. /nEstos valores van desde el 0 al 5, pasando por los valores intermedios',
    example: '4.5',
  })
  @IsString({
    message: '$property debe ser un string',
  })
  @IsNotEmpty({
    message: '$property no debe estar vacío',
  })
  @IsEnum(Rating, {
    message:
      'Hay un número limitado de valores permitidos para $property y $value no lo es',
  })
    rating: Rating;
}
