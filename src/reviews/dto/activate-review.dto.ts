import { IsBoolean, IsUUID } from 'class-validator';

export class ActivateReviewDto {
  @IsUUID(4, {
    message:'$property must be a valid uuid version $constraint1',
  })
    //reviewId
    reviewId:string;

  @IsBoolean({
    message:'$property debe ser de tipo booleano, en cambio enviaste $value',
  })
    //activate
    activate: boolean;
}