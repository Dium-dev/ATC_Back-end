import { Injectable } from '@nestjs/common';
import { transporter } from '../utils/mailer/mailer';

@Injectable()
export class MailService {
  async sendMails(data: any, topic: string): Promise<void> {
    switch (topic) {
      case 'RESET_PASSWORD':
        transporter.sendMail({
          to: 'correodeprueba', //Coloca tu dirección de correo si estás haciendo pruebas
          subject: 'Reseteo de contraseña',
          html: '<h1>Hola wakakakakak</h1>',
        });
      default:
        return;
    }
  }
}
