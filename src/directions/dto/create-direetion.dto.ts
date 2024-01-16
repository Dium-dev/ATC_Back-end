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

  @IsOptional({ always: true })
  @IsString({ message: 'La propiedad "barrio" debe ser de tipo string' })
  @ApiProperty({
    description:
      'Debe contener el nombre del barrio al que el usuario pertenece como parte de la descripción de su dirección',
    nullable: true,
  })
    neighborhood?: string;

  @IsOptional({ always: true })
  @IsString({ message: 'La propiedad "barrio" debe ser de tipo string' })
  @ApiProperty({
    description:
      'Debe contener el numero de telefono del usuario o perteneciente e la ubicación.\nDe no pasarle nada, el se completa con el numero del usuario',
    nullable: true,
  })
    phone?: string;
}
