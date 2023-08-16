import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail(undefined, { message: 'El formato del email no es valido' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @ApiProperty({
    description:
      'Recibe el email del usuario y verifica si es el formato adecuado. Requerido',
  })
  email: string;

  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @Matches(/^(?=.*[A-Za-zñÑáéíóúÁÉÍÓÚàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛ])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-zñÑáéíóúÁÉÍÓÚàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛ\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/, {
    message:
      'La contraseña debe ser de 8 a 15 caracteres, tener una mayúscula, una minúscula, un número y un carácter especial',
  },
  )
  @ApiProperty({
    description:
      'Recibe una contraseña que debe ser de 8 a 15 caracteres, tener una mayúscula, una minúscula, un número y un carácter especial. Requerido',
  })
  password: string;

  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @ApiProperty({
    description: 'Recibe el nombre del usuario, requerido',
  })
  firstName: string;

  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @ApiProperty({
    description: 'Recibe el apellido del usuario, requerido',
  })
  lastName: string;

  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @ApiProperty({
    description: 'Recibe el telefono de contacto del usuario, requerido',
  })
  phone: string;
}
