import {
  Controller,
  Get,
  Post,
  Body,
  Res,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Ruta para crear un pago
  @ApiOperation({
    summary:
    'Ruta para realizar pagos.',
  })
  @Post('create-payment')
  async createPayment(@Body() createPaymentDto: CreatePaymentDto, @Res() res: Response) {
    try {
      const paymentUrl = await this.paymentsService.createPayment(createPaymentDto);
      // Redirige al usuario a la URL de pago generada por Mercado Pago
      res.redirect(paymentUrl);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el pago' });
    }
  }

  // Ruta para manejar un pago exitoso
  @ApiOperation({
    summary:
    'Ruta para manejar un pago exitoso.',
  })
  @Get('success')
  handleSuccessPayment(@Res() res: Response) {
    res.redirect('http://localhost:3000/payment/success');
  }

  // Ruta para manejar un pago fallido
  @ApiOperation({
    summary:
    'Ruta para manejar un pago fallido.',
  })
  @Get('failure')
  handleFailurePayment(@Res() res: Response) {
    res.redirect('http://localhost:3000/payment/failure');
  }

  // Ruta para manejar un pago pendiente
  @ApiOperation({
    summary:
    'Ruta para manejar un pago pendient.',
  })
  @Get('pending')
  handlePendingPayment(@Res() res: Response) {
    res.redirect('http://localhost:3000/payment/pending');
  }

}