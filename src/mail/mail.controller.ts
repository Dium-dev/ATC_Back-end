import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { MailService } from './mail.service';
import{IContactFormAdminContext} from './interfaces/contact-form-admin-context.interface';
import{IContactFormUserContext} from './interfaces/contact-form-user-cotext.interface';


@Controller('contact')
export class ContactController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  async sendContactForm(@Body() contactData: any, @Res() res: Response) {
    try {
      const userContext: IContactFormUserContext = {
        firstname: contactData.firstname,
      };
      await this.mailService.sendMails({
        addressee: contactData.email, 
        subject: 'CONTACT_FORM_USER', 
        context: userContext,
      });

      const adminContext: IContactFormAdminContext = {
        firstname: contactData.firstname, 
        contactInfo: contactData.email, 
        message: contactData.message,
      };
      await this.mailService.sendMails({
        addressee: 'rehide5646@scubalm.com', 
        subject: 'CONTACT_FORM_ADMIN', //
        context: adminContext,
      });

      return res.status(200).json({ message: 'Formulario de contacto enviado con éxito' });
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  }
}
