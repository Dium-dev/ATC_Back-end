import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { MailService } from './mail.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  async sendContactForm(@Body() contactData: any, @Res() res: Response) {
    // Aquí procesas los datos del formulario y luego llamas a MailService para enviar los correos electrónicos.
    // Debes ajustar contactData para que coincida con los datos que esperas en el formulario.

    try {
      // Envía un correo al usuario informando que recibieron su consulta.
      const userContext = {
        // Define el contexto del correo para el usuario.
      };
      await this.mailService.sendContactFormEmail(contactData.userEmail, userContext);

      // Envía un correo al administrador informando que tienen una consulta para responder.
      const adminContext = {
        // Define el contexto del correo para el administrador.
      };
      await this.mailService.sendContactFormEmail('correo_del_administrador@example.com', adminContext);

      return res.status(200).json({ message: 'Formulario de contacto enviado con éxito' });
    } catch (error) {
      // Manejo de errores
      return res.status(error.status).json({ error: error.message });
    }
  }
}
