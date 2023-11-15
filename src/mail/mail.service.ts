import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IResponse } from 'src/utils/interfaces/response.interface';
import { SendMailDto } from './dto/sendMail.dto';
import { Cases } from './dto/sendMail.dto';
import { Templates } from './templates/enums/templates_enum';
import { IResetPasswordContext } from './interfaces/reset-password-context.interface';
import { ICreateUserContext } from './interfaces/create-account-context.interface';
import { IPurchaseContext } from './interfaces/purchase-context.interface';
import { IContactFormAdminContext } from './interfaces/contact-form-admin-context.interface';
import { IContactFormUserContext } from './interfaces/contact-form-user-context.interface';
import { IUpdateOrderContext } from './interfaces/update-order-context.interface';

export type AnyContextType = IResetPasswordContext | ICreateUserContext | IPurchaseContext | IContactFormAdminContext | IContactFormUserContext | IUpdateOrderContext;

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  //Si no hay un contexto, simplemente pon '{}'
  async sendMails(sendMailDto: SendMailDto): Promise<IResponse> {
    const { addressee, subject, context } = sendMailDto;    
    try {
      let mail;
      switch (subject) {
        case Cases.RESET_PASSWORD:
          mail = await this.mailerService.sendMail({
            to: addressee,
            subject:
              'Se ha solicitado recuperar la contraseña de tu cuenta en ATC.',
            template: Templates.recoverPassword,
            context: context,
            attachments: [
              {
                filename: 'ATCarroLogo.png',
                path: './src/public/ATCarroLogo.png',
                cid: 'headerATCLogo',
              },
            ],
          });
          break;
        case Cases.CREATE_ACCOUNT:
          mail = await this.mailerService.sendMail({
            to: addressee,
            subject: 'Nueva cuenta registrada con éxito.',
            template: Templates.createAccount,
            context: context,
            attachments: [
              {
                filename: 'ATCarroLogo.png',
                path: './src/public/ATCarroLogo.png',
                cid: 'headerATCLogo',
              },
            ],
          });
          break;
        case Cases.PURCHASE:
          mail = await this.mailerService.sendMail({
            to: addressee,
            subject: 'Nueva compra.',
            template: Templates.purchase,
            context: context,
            attachments: [
              {
                filename: 'ATCarroLogo.png',
                path: './src/public/ATCarroLogo.png',
                cid: 'headerATCLogo',
              },
            ],
          });
          break;
        case Cases.CONTACT_FORM_USER:
          mail = await this.mailerService.sendMail({
            to: addressee,
            subject: 'Recibimos tu consulta',
            template: Templates.contactFormUser,
            context: context,
            attachments: [
              {
                filename: 'ATCarroLogo.png',
                path: './src/public/ATCarroLogo.png',
                cid: 'headerATCLogo',
              },
            ],
          });
          break;
        case Cases.CONTACT_FORM_ADMIN:
          if ('userId' in context)
          mail = await this.mailerService.sendMail({
            to: addressee,
            subject: context.userId
            ? `Ayuda para Usuario ID: ${context.userId}`
            : 'Recibiste una Consulta Gral',
            template: Templates.contactFormAdmin,
            context: context,
            attachments: [
              {
                filename: 'ATCarroLogo.png',
                path: './src/public/ATCarroLogo.png',
                cid: 'headerATCLogo',
              },
            ],
          });
          break;

        case Cases.UPDATE_ORDER:
          if ('consultationReason' in context)
            mail = await this.mailerService.sendMail({
              to: addressee,
              subject: `Recibiste una solicitud de cambio en la orden nro ${context.order} - Motivo: "${context.consultationReason}"`,
              template: Templates.updateOrder,
              context: context,
              attachments: [
                {
                  filename: 'ATCarroLogo.png',
                  path: './src/public/ATCarroLogo.png',
                  cid: 'headerATCLogo',
                },
              ],
            });
          break;

      }
      //If mail.accepted: [ user_email ]
      if (mail && mail.accepted && mail.accepted.length) {
        return {
          statusCode: 200,
          message: 'El link para recuperar la contraseña ha sido enviado',
        };
      } else {
        throw new InternalServerErrorException(
          'Error al enviar el correo de recuperación',
        );
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}