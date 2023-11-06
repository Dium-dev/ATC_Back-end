import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDireetionDto {
  @IsOptional()
  @IsInt({ message: 'El código postal debe ser un número entero' })
  @ApiProperty({ description: 'Codigo Postal' })
  codigoPostal: number;

  @IsOptional()
  @IsString({ message: 'La ciudad debe ser un string' })
  @ApiProperty({ description: 'Ciudad' })
  ciudad: string;

  @IsOptional()
  @IsString({ message: 'El estado debe ser un string' })
  @ApiProperty({ description: 'Estado' })
  estado: string;

  @IsOptional()
  @IsString({ message: 'La calle debe ser un string' })
  @ApiProperty({ description: 'Calle' })
  calle: string;
}
