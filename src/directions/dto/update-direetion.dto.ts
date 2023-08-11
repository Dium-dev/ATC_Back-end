import { IsString, IsOptional, IsInt } from 'class-validator';

export class UpdateDireetionDto {

  @IsOptional()
  @IsInt({ message: 'El código postal debe ser un número entero' })
    codigoPostal: number;

  @IsOptional()
  @IsString({ message: 'La ciudad debe ser un string' })
    ciudad: string;

  @IsOptional()
  @IsString({ message: 'El estado debe ser un string' })
    estado: string;

  @IsOptional()
  @IsString({ message: 'La calle debe ser un string' })
    calle: string;



}
