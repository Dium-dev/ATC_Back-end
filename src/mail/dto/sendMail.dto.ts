import { IsDefined, IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IContext } from '../interfaces/context.interface';

export enum Cases {
  RESET_PASSWORD = 'RESET_PASSWORD',
}

export class SendMailDto {
  @IsString({
    message:'$property debe ser de tipo string',
  })
  @IsEmail(undefined, {
    message:'$property debe ser un correo válido, en cambio es $value',
  })
  @IsNotEmpty({
    message: '$property no puede estar vacío',
  })
    addressee: string;

  @IsEnum(Cases, {
    message:'$value no está entre los posibles casos para envío de correo',
  })
    subject: string;

  @IsDefined({
    message: '$property debe estar definido, revisa los parámetros requeridos',
  })
    context: IContext;
}