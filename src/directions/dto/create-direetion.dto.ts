import {IsString, IsInt} from 'class-validator'

export class CreateDireetionDto {
   
    @IsInt({ message: 'El código postal debe ser un número entero' })
    codigoPostal: number

    
    @IsString({ message: 'La ciudad debe ser un string' })
    ciudad: string

    
    @IsString({ message: 'El estado debe ser un string' })
    estado: string

   
    @IsString({ message: 'La calle debe ser un string' })
    calle: string


}
