import { IsEnum, IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { Rating } from '../entities/review.entity';


export class CreateReviewDto {

  //review
  @IsString({
    message:'$property debe ser un string',
  })
  @IsNotEmpty({
    message:'$property no debe estar vacío',
  })
  @MinLength(10, {
    message: '$property is too short, minumum length must be $constraint1, but actual is $value',
  })
  @MaxLength(500, {
    message: '$property is too long, maximum length must be $constraint1, but actual is $value',
  })
    review: string;

  //rating
  @IsString({
    message:'$property debe ser un string',
  })
  @IsNotEmpty({
    message:'$property no debe estar vacío',
  })
  @IsEnum(Rating, {
    message:'$value no es un valor permitido, prueba con $constraint1',
  })
    rating: Rating;
}
