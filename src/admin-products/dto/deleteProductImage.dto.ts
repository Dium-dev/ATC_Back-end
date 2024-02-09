import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export interface IDeleteProductImage {
  id: string;
  productId: string;
}

export class DeleteProductImageDto implements IDeleteProductImage {
  @IsNotEmpty({ message: 'La propiedad $porperty no debe ser nula!' })
  @IsUUID('4', {
    message: 'La propiedad $property debe ser un Id de tipo UUID-V4',
  })
  id: string;
  @IsNotEmpty({ message: 'La propiedad $porperty no debe ser nula!' })
  @IsString({ message: 'La porpiedad $property debe ser una string!' })
  productId: string;
}
