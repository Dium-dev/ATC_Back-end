import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RecoverPasswordDto {
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @IsEmail()
  @ApiProperty({
    description: 'Email de usuario que perdio la contraseña',
  })
  email: string;
}
