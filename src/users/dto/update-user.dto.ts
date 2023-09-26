import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: '$property debe ser un string' })
  @ApiProperty({
    description:
      'Recibe el $property del usuario y verifica si es un string. Opcional',
  })
    firstName: string;

  @IsOptional()
  @IsString({ message: '$property debe ser un string' })
  @ApiProperty({
    description:
      'Recibe el $property del usuario y verifica si es un string. Opcional',
  })
    lastName: string;

  @IsOptional()
  @IsString({ message: '$property debe ser un string' })
  @IsEmail(undefined, { message: 'formato de $property invalido' })
  @ApiProperty({
    description:
      'Recibe el $property del usuario y verifica si es el formato adecuado. Opcional',
  })
    email: string;

  @IsOptional()
  @IsString({ message: '$property debe ser un string' })
  @ApiProperty({
    description:
      'Recibe el $property del usuario y verifica si es el formato adecuado. Opcional',
  })
    phone: string;
}
