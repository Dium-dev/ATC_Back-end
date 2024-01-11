import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsUUID('4', { message: 'Se debe proporcionar el Id del usuario' })
  @IsOptional({ message: 'El campo $property no debe estar vacio' })
  /*El campo es opcional porque en cierta instancia (controller) no es requerida del body, 
  en cambio en el service se indica como tipo de dato del create*/
  userId?: string;

  @IsUUID('4', {
    message: 'Recuerda mandar el Id de la direccion seleccionada',
  })
  @IsNotEmpty({ message: 'El campo $property no debe estar vacio' })
  directionId: string;
}
