import { Controller, Post, Body, InternalServerErrorException } from '@nestjs/common';
import { MailService } from './mail.service';
import { IContactFormAdminContext } from './interfaces/contact-form-admin-context.interface';
import { IContactFormUserContext } from './interfaces/contact-form-user-context.interface';
import { IUpdateOrderContext } from './interfaces/update-order-context.interface';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { ContactFormDto, UpdateOrderDto } from './dto/sendMail.dto';
import { Cases } from 'src/mail/dto/sendMail.dto';
import { ADMIN_EMAIL } from 'src/config/env';
import { ConsultationReason } from './interfaces/update-order-context.interface';
import { HttpException } from '@nestjs/common/exceptions';


@ApiTags('Mail')
@Controller('contact')
export class ContactController {
  constructor(private readonly mailService: MailService) { }

  @ApiOperation({
    summary: 'Ruta para enviar solicitud de cambio en la orden',
  })
  @ApiBody({ type: UpdateOrderDto })
  @Post('update-order')
  async sendUpdateOrderForm(
    @Body() updateOrderData: UpdateOrderDto) {
    try {
      // Obtener el motivo de la consulta
      const consultationReason: ConsultationReason = updateOrderData.consultationReason;

      // Contexto para el administrador
      const updateContext = {
        name: updateOrderData.name,
        phone: updateOrderData.phone,
        message: updateOrderData.message,
        userEmail: updateOrderData.userEmail,
        order: updateOrderData.order,
        consultationReason: updateOrderData.consultationReason,
      };

      // Contexto para el usuario
      const userContext = {
        firstname: updateOrderData.name,
      };

      // Enviar correos electrónicos
      await this.mailService.sendMails({
        addressee: ADMIN_EMAIL,
        subject: Cases.UPDATE_ORDER,
        context: updateContext,
      });

      await this.mailService.sendMails({
        addressee: updateOrderData.userEmail,
        subject: Cases.CONTACT_FORM_USER,
        context: userContext,
      });

      return {
        status: 200,
        message: 'Solicitud de cambio en la orden enviada con éxito',
      };
    } catch (error) {
      throw new HttpException({ 
        status: error.status, 
        error: error.message, 
        cause: new Error("Some Error")
      }, error.status);
    }
  }

  @ApiOperation({
    summary: 'Ruta para contact form del front',
  })
  @ApiBody({ type: ContactFormDto })
  @Post()
  async sendContactForm(
    @Body() contactData: ContactFormDto,
    /*  @Res() res: Response, */
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
        subject: Cases.CONTACT_FORM_ADMIN,
        context: adminContext,
      });
      
      return {
        status: 200,
        message: 'Formulario de contacto enviado con éxito',
      }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}
