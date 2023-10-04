import { IsString, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDireetionDto {
  @IsNotEmpty({ message: 'Debe agregar un codigo postal' })
  @IsInt({ message: 'El código postal debe ser un número entero' })
  @ApiProperty({ description: 'Codigo Postal' })
    codigoPostal: number;

  @IsNotEmpty({ message: 'Debe agregar una ciudad' })
  @IsString({ message: 'La ciudad debe ser un string' })
  @ApiProperty({ description: 'Ciudad' })
    ciudad: string;

  @IsNotEmpty({ message: 'Debe agregar un estado' })
  @IsString({ message: 'El estado debe ser un string' })
  @ApiProperty({ description: 'Estado' })
    estado: string;

  @IsNotEmpty({ message: 'Debe agregar una calle' })
  @IsString({ message: 'La calle debe ser un string' })
  @ApiProperty({ description: 'Calle' })
    calle: string;

  @IsNotEmpty({ message: 'Debe agregar un userId' })
  @IsString({ message: 'El userId debe ser un string' })
  @ApiProperty({ description: 'userId' })
    userId: string;
}
