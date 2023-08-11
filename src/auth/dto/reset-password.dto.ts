import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, Matches, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @IsUUID('4')
  @ApiProperty({
    description: 'Token enviado al correo del usuario',
  })
    resetPasswordToken: string;

  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&]{8,15}/,
  )
  @ApiProperty({
    description:
      'Contraseña nueva. Debe ser de 8 a 15 caracteres, tener una mayúscula, una minúscula, un número y un carácter especial.',
  })
    password: string;
}
