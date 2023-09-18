import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class LoginUserDto {
  @IsEmail(undefined, { message: 'El formato del email no es valido' })
  @IsNotEmpty({ message: 'el $property es requerido para iniciar sesión' })
  @ApiProperty({
    description:
      'Recibe el email del usuario y verifica si es el formato adecuado. Requerido',
  })
  email: string;

  @IsString({ message: '$property debe ser un string' })
  @IsNotEmpty({ message: '$property es requerida para iniciar sesión' })
  @Matches(
    /^(?=.*[A-Za-zñÑáéíóúÁÉÍÓÚàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛ])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-zñÑáéíóúÁÉÍÓÚàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛ\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/,
    {
      message:
        'La $property debe ser de 8 a 15 caracteres, tener una mayúscula, una minúscula, un número y un carácter especial..',
    },
  )
  @ApiProperty({
    description:
      'Recibe una contraseña que debe ser de 8 a 15 caracteres, tener una mayúscula, una minúscula, un número y un carácter especial. Requerido',
  })
  password: string;
}
