import { IsString, IsNotEmpty, MinLength, MaxLength, IsEnum, IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { Rating } from '../entities/review.entity';

export class UpdateReviewDto {
  //userId
  @IsUUID(4, {
    message:'$property must be a valid uuid version $constraint1',
  })
    reviewId: string;
    
  //review
  @IsOptional()
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
  @IsOptional()
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

  //active
  /* @IsOptional()
  @IsBoolean({
    message:'$property debe ser de tipo booleano, en cambio enviaste $value',
  })
    activate:boolean; */
}
