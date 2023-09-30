import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Res,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
<<<<<<< HEAD
import { GetUser } from 'src/auth/auth-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guarg';
=======
>>>>>>> 09cdee52d0cfdf9b7d88ef1f29cc5b8924848224

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Ruta para crear un pago
  @ApiOperation({
    summary:
    'Ruta para realizar pagos.',
  })
<<<<<<< HEAD
  @UseGuards(JwtAuthGuard)
  @Post('create-payment')
  async createPayment(
  @GetUser() { userId }: any,
    @Body() { amount, orderId }: CreatePaymentDto,
    @Res() res: Response,
  ) {
=======
  @Post('create-payment')
  async createPayment(@Body() createPaymentDto: CreatePaymentDto, @Res() res: Response) {
>>>>>>> 09cdee52d0cfdf9b7d88ef1f29cc5b8924848224
    try {
      const payment = await this.paymentsService.createPayment(amount, userId, orderId);
      // Redirige al usuario a la URL de pago generada por Mercado Pago

      res.send(payment.url);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el pago' });
    }
  }

  // Ruta para manejar un pago exitoso
  @ApiOperation({
    summary:
    'Ruta para manejar un pago exitoso.',
  })
<<<<<<< HEAD
  @Get('success/:orderid')
  async handleSuccessPayment(
  @Param('orderid') orderid: string,
    @Res() res: Response,
  ) {
    const actualize = await this.paymentsService.actualizePayment('success', orderid);
    res.send(actualize);
=======
  @Get('success')
  handleSuccessPayment(@Res() res: Response) {
    res.redirect('http://localhost:3000/payment/success');
>>>>>>> 09cdee52d0cfdf9b7d88ef1f29cc5b8924848224
  }

  // Ruta para manejar un pago fallido
  @ApiOperation({
    summary:
    'Ruta para manejar un pago fallido.',
  })
<<<<<<< HEAD
  @Get('failure/:orderid')
  async handleFailurePayment(
  @Param('orderid') orderid: string,
    @Res() res: Response,
  ) {
    const actualize = await this.paymentsService.actualizePayment('failure', orderid);
    res.send(actualize);
=======
  @Get('failure')
  handleFailurePayment(@Res() res: Response) {
    res.redirect('http://localhost:3000/payment/failure');
>>>>>>> 09cdee52d0cfdf9b7d88ef1f29cc5b8924848224
  }

  // Ruta para manejar un pago pendiente
  @ApiOperation({
    summary:
<<<<<<< HEAD
    'Ruta para manejar un pago pendiente.',
  })
  @Get('pending/:orderid')
  async handlePendingPayment(
  @Param('orderid') orderid: string,
    @Res() res: Response,
  ) {
    const actualize = await this.paymentsService.actualizePayment('pending', orderid);
    res.send(actualize);
=======
    'Ruta para manejar un pago pendient.',
  })
  @Get('pending')
  handlePendingPayment(@Res() res: Response) {
    res.redirect('http://localhost:3000/payment/pending');
>>>>>>> 09cdee52d0cfdf9b7d88ef1f29cc5b8924848224
  }

}