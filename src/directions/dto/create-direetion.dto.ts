import { IsString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Direction } from '../entities/direction.entity';

export class CreateDirectionDto extends Direction {
  @IsNotEmpty({ message: 'Debe agregar una ciudad' })
  @IsString({ message: 'La ciudad debe ser un string' })
  @ApiProperty({ description: 'Ciudad' })
  city: string;

  @IsNotEmpty({ message: 'Debe agregar un estado' })
  @IsString({ message: 'El estado debe ser un string' })
  @ApiProperty({ description: 'Estado' })
  district: string;

  @IsNotEmpty({ message: 'Debe agregar una dirección' })
  @IsString({ message: 'La dirección debe ser un string' })
  @ApiProperty({ description: 'Calle' })
  address: string;

  @IsOptional({ always: true })
  @IsString({
    message:
      'La propiedad "Referencia de la dirección" debe ser de tipo string',
  })
  @ApiProperty({
    description:
      'Debe contener una descripción de referencia sobre la dirección, teniendo en cuenta datos como\n- Numero de departamento\n- Altura\n- piso\nEntre otros datos que considere importante',
    nullable: true,
  })
  addressReference?: string;

  @IsNotEmpty({ message: 'Debe agregar un userId' })
  @IsString({ message: 'El userId debe ser un string' })
  @ApiProperty({ description: 'userId' })
  userId: string;
}
