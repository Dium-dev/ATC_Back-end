import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { MailService } from './mail.service';
import{IContactFormAdminContext} from './interfaces/contact-form-admin-context.interface';
import{IContactFormUserContext} from './interfaces/contact-form-user-cotext.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContactFormDto } from './dto/sendMail.dto';


@ApiTags('Mail')
@Controller('contact')
export class ContactController {
  constructor(private readonly mailService: MailService) {}

  @ApiOperation({
    summary:
    'Ruta para contact form del front',
  })

  @Post()
  async sendContactForm(@Body() contactData: ContactFormDto, @Res() res: Response) {
    try {
      const userContext: IContactFormUserContext = {
        firstname: contactData.name,
      };
      await this.mailService.sendMails({
        addressee: contactData.userEmail, 
        subject: 'CONTACT_FORM_USER', 
        context: userContext,
      });

      const adminContext: IContactFormAdminContext = {
        firstname: contactData.name, 
        contactInfo: contactData.userEmail, 
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
