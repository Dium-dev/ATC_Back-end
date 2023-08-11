import { IsNotEmpty, Matches, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs-swagger';

export class ChangePasswordDto {
  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&]{8,15}/,
  )
  @ApiProperty({
    description:
      'Contraseña actual. Debe ser de 8 a 15 caracteres, tener una mayúscula, una minúscula, un número y un carácter especial.',
  })
    oldPassword: string;

  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&]{8,15}/,
  )
  @ApiProperty({
    description:
      'Nueva contraseña. Debe ser de 8 a 15 caracteres, tener una mayúscula, una minúscula, un número y un carácter especial.',
  })
    newPassword: string;
}
