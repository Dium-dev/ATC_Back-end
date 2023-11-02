import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { IResetPasswordContext } from '../interfaces/reset-password-context.interface';
import { ICreateUserContext } from '../interfaces/create-account-context.interface';
import { IPurchaseContext } from '../interfaces/purchase-context.interface';
import { IContactFormAdminContext } from '../interfaces/contact-form-admin-context.interface';
import { IContactFormUserContext } from '../interfaces/contact-form-user-cotext.interface';

export enum Cases {
  RESET_PASSWORD = 'RESET_PASSWORD',
  CREATE_ACCOUNT = 'CREATE_ACCOUNT',
  PURCHASE = 'PURCHASE',
  CONTACT_FORM_ADMIN = 'CONTACT_FORM_ADMIN',
  CONTACT_FORM_USER = 'CONTACT_FORM_USER',
}

export class ContactFormDto {
  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @ApiProperty({
    description: 'Recibe el nombre del usuario, requerido',
  })
  name: string;

  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @ApiProperty({
    description: 'Recibe el telefono de contacto del usuario, requerido',
  })
  phone: string;

  @IsString({ message: 'El campo $property debe ser un texto' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @ApiProperty({
    description: 'Mensaje del usuario, requerido',
  })
  message: string;

  @IsEmail(undefined, { message: 'El formato del email no es valido' })
  @IsNotEmpty({ message: 'El campo $property está vacío' })
  @ApiProperty({
    description:
      'Recibe el email del usuario y verifica si es el formato adecuado. Requerido',
  })
  userEmail: string; // Agrega este campo para capturar el correo del usuario
}

//Por si no es necesario el 'context'
interface INotSend {
  sendExtraData: false;
}

export class SendMailDto {
  @IsString({
    message: '$property debe ser de tipo string',
  })
  @IsEmail(undefined, {
    message: '$property debe ser un correo válido, en cambio es $value',
  })
  @IsNotEmpty({
    message: '$property no puede estar vacío',
  })
  addressee: string;

  @IsEnum(Cases, {
    message: '$value no está entre los posibles casos para envío de correo',
  })
  subject: string;

  @IsDefined({
    message: '$property debe estar definido, revisa los parámetros requeridos',
  })
  context:
    | IResetPasswordContext
    | ICreateUserContext
    | IPurchaseContext
    | IContactFormAdminContext
    | IContactFormUserContext
    | INotSend;
}
