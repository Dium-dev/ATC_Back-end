import { Injectable, BadRequestException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IResponse } from 'src/utils/interfaces/response.interface';
import { IContext } from './interfaces/context.interface';
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMails(
    to: string,
    subject: string,
    template: string,
    context: IContext,
  ): Promise<IResponse> {
    switch (subject) {
      case 'RESET_PASSWORD':
        const mail = await this.mailerService.sendMail({
          to,
          subject:
            'Se ha solicitado recuperar la contraseña de tu cuenta en ATC',
          template: `./${template}`,
          context,
        });

        if (mail) {
          return {
            statusCode: 200,
            message: 'El link para recuperar la contraseña ha sido enviado',
          };
        } else {
          throw new BadRequestException(
            'Error al enviar el correo de recuperación',
          );
        }
      default:
        return;
    }
  }
}
