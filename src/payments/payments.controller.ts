import {
  Controller,
  Get,
  Post,
  Body,
  Res,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Ruta para crear un pago
  @Post('create-payment')
  async createPayment(@Body() createPaymentDto: CreatePaymentDto, @Res() res) {
    try {
      const paymentUrl = await this.paymentsService.createPayment(createPaymentDto);
      // Redirige al usuario a la URL de pago generada por Mercado Pago
      res.redirect(paymentUrl);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el pago' });
    }
  }

  // Ruta para manejar un pago exitoso
  @Get('success')
  handleSuccessPayment(@Res() res) {
    res.redirect('http://tu-sitio.com/payment/success');
  }

  // Ruta para manejar un pago fallido
  @Get('failure')
  handleFailurePayment(@Res() res) {
    res.redirect('http://tu-sitio.com/payment/failure');
  }

  // Ruta para manejar un pago pendiente
  @Get('pending')
  handlePendingPayment(@Res() res) {
    res.redirect('http://tu-sitio.com/payment/pending');
  }

}
