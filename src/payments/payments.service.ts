import * as mercadopago from 'mercadopago';
import { ACCESS_TOKEN } from 'src/config/env';
import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
mercadopago.configurations.setAccessToken(ACCESS_TOKEN);

@Injectable()
export class PaymentsService {
  constructor() {
    mercadopago.configure({
      access_token: process.env.ACCESS_TOKEN,
    });
  }

  async createPayment(paymentData: CreatePaymentDto): Promise<string> {
    try {
      // Crea un objeto de preferencia con los detalles del pago
      const preference = {
        items: [
          {
            title: 'Descripción del producto',
            quantity: 1,
            currency_id: 'ARS', // Moneda (Asegúrate de usar la moneda correcta)
            unit_price: paymentData.amount, // Monto del pago
          },
        ],
        payer: {
          email: paymentData.email, // Correo del comprador
        },
      };

      // Crea la preferencia en Mercado Pago
      const response = await mercadopago.preferences.create(preference);
      // Devuelve la URL de pago generada
      return response.body.init_point;
    } catch (error) {
      console.error('Error al crear el pago:', error);
      throw error;
    }
  }

}
