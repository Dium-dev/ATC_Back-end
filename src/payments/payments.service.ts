import * as mercadopago from 'mercadopago';
import { ACCESS_TOKEN, HOST } from '../config/env';
import { Injectable, HttpException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Payment, PaymentState } from './entities/payment.entity';
import { Order, OrderStateEnum } from '../orders/entities/order.entity';
import { CreatePreferencePayload } from 'mercadopago/models/preferences/create-payload.model';
import { MailService } from '../mail/mail.service';
import { Cases } from 'src/mail/dto/sendMail.dto';
import { IPurchaseContext } from '../mail/interfaces/purchase-context.interface';
import { Product } from '../products/entities/product.entity';
import { ShoppingCart } from '../shopping-cart/entities/shopping-cart.entity';
import { CartProduct } from '../shopping-cart/entities/cart-product.entity';
mercadopago.configurations.setAccessToken(ACCESS_TOKEN);

@Injectable()
export class PaymentsService {
  constructor(
    private readonly mailsService: MailService,
  ) {
    mercadopago.configure({
      access_token: process.env.ACCESS_TOKEN,
    });
  }

  async createPayment(amount: number, userId: string, orderId?: string) {
    try {
      const user = await User.findByPk(userId);

      const preference: CreatePreferencePayload = {
        items: [
          {
            title: 'Descripción del producto',
            quantity: 1,
            currency_id: 'COP',
            unit_price: amount,
          },
        ],
        payer: {
          name: user.firstName,
          email: user.email,
        },
        back_urls: {
          success: `${HOST}/payments/success/${orderId}`,
          failure: `${HOST}/payments/failure/${orderId}`,
          pending: `${HOST}/payments/pending/${orderId}`,
        },
        notification_url: `https://af6f-190-173-138-188.ngrok-free.app/payments/webhook/${orderId}`, //Cambiar por el host del servidor deployado
      };
      const response = await mercadopago.preferences.create(preference);
      await Payment.create({
        id: response.body.id,
        orderId,
        user_email: user.email,
        amount,
        state: PaymentState.PENDING,
      });

      return {
        url: response.body.init_point,
        paymentId: response.body.id,
      };
    } catch (error) {
      throw new Error('Error al crear el pago:' + error.message);
    }
  }

  async actualizePayment(state: string, orderId: string) {
    try {
      const order = await Order.findByPk(orderId);

      state == 'success' ? order.state = OrderStateEnum.PAGO :
        state == 'pending' ? order.state = OrderStateEnum.PENDIENTE :
          order.state = OrderStateEnum.RECHAZADO;
      await order.save();

      const payment = await Payment.findOne({ where: { orderId } });
      state == 'success' ? payment.state = PaymentState.SUCCESS :
        state == 'pending' ? payment.state = PaymentState.PENDING :
          payment.state = PaymentState.FAILED;
      await payment.save();

      if (state == 'success') {
        const user = await User.findByPk(order.userId, { include: [ ShoppingCart ] });
        const cartId = user.cart.id;
        const products = await CartProduct.findAll({
          where: { cartId },
        });
        for (const prod of products) {
          const productDB = await Product.findByPk(prod.productId);
          productDB.stock--;
          await productDB.save();
        }
        await CartProduct.destroy({
          where: { cartId },
        });
      }

      return `El estado de la orden es:${state}`;
    } catch (error) {
      console.log(error.message);
      throw new HttpException('Error al actualizar el pago', 404);
    }
  }

  async actualizeOrder(paymentid: number, orderId: string) {
    try {
      const payment = await mercadopago.payment.findById(paymentid);

      const status = payment.body.status;
      const cuotes = payment.body.installments;
      const cuotesValue = payment.body.transaction_details.installment_amount;

      if (status == 'rejected') await this.actualizePayment('failure', orderId);
      if (status == 'in_process') await this.actualizePayment('pending', orderId);
      if (status == 'approved') {
        const order = await Order.findByPk(orderId);
        const user = await User.findByPk(order.userId);

        const products = await Product.findAll({
          include: [
            {
              model: Order,
              where: { id: order.id },
              through: { attributes: ['amount', 'price'] },
            },
          ],
        });

        const context: IPurchaseContext = {
          name: user.firstName,
          products: products.map(({ title, price }) => {
            return {
              productName: title,
              price,
            };
          }),
          total: payment.body.transaction_details.total_paid_amount,
          purchaseDate: order.createdAt,
          cuotes,
          cuotesValue,
        };

        const mailData = {
          addressee: user.email,
          subject: Cases.PURCHASE,
          context: context,
        };

        await this.mailsService.sendMails(mailData);
        await this.actualizePayment('success', orderId);
      }
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
}
