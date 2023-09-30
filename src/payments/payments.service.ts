import * as mercadopago from 'mercadopago';
import { ACCESS_TOKEN } from 'src/config/env';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Payment, PaymentState } from './entities/payment.entity';
import { Order, OrderStateEnum } from 'src/orders/entities/order.entity';
mercadopago.configurations.setAccessToken(ACCESS_TOKEN);

@Injectable()
export class PaymentsService {
  constructor() {
    mercadopago.configure({
      access_token: process.env.ACCESS_TOKEN,
    });
  }

<<<<<<< HEAD
  async createPayment(amount: number,  userId: string, orderId?: string) {
=======
  async createPayment(paymentData: CreatePaymentDto): Promise<string> {
>>>>>>> 09cdee52d0cfdf9b7d88ef1f29cc5b8924848224
    try {
      const user = await User.findByPk(userId);
      // Crea un objeto de preferencia con los detalles del pago
      const preference = {
        items: [
          {
            title: 'Descripción del producto',
            quantity: 1,
            currency_id: 'COP', // Moneda (Asegúrate de usar la moneda correcta)
            country: 'CO',
            unit_price: amount, // Monto del pago
          },
        ],
        payer: {
          name: user.firstName,
          email: user.email, // Correo del comprador
        },
        back_urls: {
          success: `http://localhost:3000/payments/success/${orderId}`,
          failure: `http://localhost:3000/payments/failure/${orderId}`,
          pending: `http://localhost:3000/payments/pending/${orderId}`,
        },
      };
<<<<<<< HEAD
=======

>>>>>>> 09cdee52d0cfdf9b7d88ef1f29cc5b8924848224
      // Crea la preferencia en Mercado Pago
      const response = await mercadopago.preferences.create(preference);

      // Guardamos los datos del pago en la base de datos
      await Payment.create({
        id: response.body.id,
        orderId,
        user_email: user.email,
        amount,
        state: PaymentState.PENDING,
      });

      // Devuelve la URL de pago generada
      return {
        url: response.body.init_point,
        id: response.body.id,
      };
    } catch (error) {
      console.error('Error al crear el pago:', error);
      throw error;
    }
  }


  async actualizePayment(state: string, orderId: string) {
    const order = await Order.findByPk(orderId);
    state == 'success' ? order.state = OrderStateEnum.PAGO :
      state == 'pending' ? order.state = OrderStateEnum.PENDIENTE :
        await order.destroy();
    await order.save();

    const payment = await Payment.findOne({ where: { orderId } });
    state == 'success' ? payment.state = PaymentState.SUCCESS :
      state == 'pending' ? payment.state = PaymentState.PENDING :
        await payment.destroy();
    await payment.save();


    return `the orden of state is:${state}`;
  }
}
