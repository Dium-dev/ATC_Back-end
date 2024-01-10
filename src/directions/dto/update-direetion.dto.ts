import { IsString, IsOptional, IsInt, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateDirectionDto } from './create-direetion.dto';

export class UpdateDirectionDto extends CreateDirectionDto {
  @IsUUID('4')
  @IsNotEmpty({message: 'Debe mandar el Id de la dirección la cual quiere actualizar.'})
  @IsString({message: 'El Id de la dirección debe ser una string de tipo UUID'})
  @ApiProperty({description: 'Id de la dirección a actualizar.'})
  id: string;
}
