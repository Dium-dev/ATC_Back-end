import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }

  // Ruta para crear un pago
  @Post('create-payment')
  async createPayment(@Body() createPaymentDto, @Res() res) {
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
