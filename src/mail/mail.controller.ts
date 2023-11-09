import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { MailService } from './mail.service';
import { IContactFormAdminContext } from './interfaces/contact-form-admin-context.interface';
import { IContactFormUserContext } from './interfaces/contact-form-user-cotext.interface';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { ContactFormDto } from './dto/sendMail.dto';
import { Cases } from 'src/mail/dto/sendMail.dto';
import { ADMIN_EMAIL } from 'src/config/env';

@ApiTags('Mail')
@Controller('contact')
export class ContactController {
  constructor(private readonly mailService: MailService) {}

  @ApiOperation({
    summary: 'Ruta para contact form del front',
  })
  @ApiBody({ type: ContactFormDto })
  @Post()
  async sendContactForm(
    @Body() contactData: ContactFormDto,
    @Res() res: Response,
  ) {
    try {
      const userContext: IContactFormUserContext = {
        firstname: contactData.name,
      };
      await this.mailService.sendMails({
        addressee: contactData.userEmail,
        subject: Cases.CONTACT_FORM_USER,
        context: userContext,
      });

      const adminContext: IContactFormAdminContext = {
        name: contactData.name,
        phone: contactData.phone,
        message: contactData.message,
        userEmail: contactData.userEmail,
      };
      await this.mailService.sendMails({
        addressee: ADMIN_EMAIL,
        subject: Cases.CONTACT_FORM_ADMIN, //
        context: adminContext,
      });

      return res
        .status(200)
        .json({ message: 'Formulario de contacto enviado con éxito' });
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  }
}
