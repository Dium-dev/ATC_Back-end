import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from '../payments.service';
import { User } from '../../users/entities/user.entity';
import { Payment, PaymentState } from '../entities/payment.entity';
import { Order, OrderStateEnum } from '../../orders/entities/order.entity';
import { MailService } from '../../mail/mail.service';
import { MailModule } from '../../mail/mail.module';
import { createOrderObject, createProductsObject, createUserObject } from './faker';
import { DatabaseModule } from '../../database/database.module';
import * as mercadopago from 'mercadopago';
import { ACCESS_TOKEN } from '../../config/env';
import { CartProduct } from '../../shopping-cart/entities/cart-product.entity';
import { ShoppingCart } from '../../shopping-cart/entities/shopping-cart.entity';
import { Product } from '../../products/entities/product.entity';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let user: any;
  let products: any;
  let order: any;

  mercadopago.configure({
    access_token: ACCESS_TOKEN,
  });

  beforeEach(async () => {
    user = createUserObject();
    products = createProductsObject(3);
    order = createOrderObject(products, user);
    const module: TestingModule = await Test.createTestingModule({
      imports: [MailModule, DatabaseModule],
      providers: [PaymentsService, MailService, Order],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPayment', () => {
    it('should create a payment and return payment details', async () => {
      // Mock dependencies
      const mockOrder = new Order(order);
      const mockUser = new User(user);

      const userFindByPkSpy = jest.spyOn(User, 'findByPk').mockResolvedValue(mockUser);

      const result = await service.createPayment(order.total, mockUser.id, mockOrder.id);

      const mockPayment = new Payment(result.paymentId, order.total);
      jest.spyOn(Payment, 'create').mockResolvedValue(mockPayment);

      const mockResponse = {
        url: result.url,
        paymentId: result.paymentId,
      };

      expect(userFindByPkSpy).toHaveBeenCalledWith(mockUser.id);

      expect(result).toEqual(mockResponse);

    });

    it('should handle errors when creating a payment', async () => {
      const mockUserId = '1';
      const mockAmount = 100;
      const mockOrderId = '12345';

      const userFindByPkSpy = jest.spyOn(User, 'findByPk').mockRejectedValue(new Error('User lookup error'));

      try {
        await service.createPayment(mockAmount, mockUserId, mockOrderId);
      } catch (error) {
        expect(userFindByPkSpy).toHaveBeenCalledWith(mockUserId);
        expect(error.message).toContain('Error al crear el pago');
      }

      userFindByPkSpy.mockReset();
    });
  });

  describe('actualizePayment', () => {
    it('should update the order and payment states for a successful payment', async () => {
      const mockUser = new User(user);
      const mockOrder = new Order(order);
      const mockPayment = new Payment();
      const mockOrderId = order.id;
      mockUser.cart = new ShoppingCart({ userId: mockUser.id });
      mockUser.cart.products = [];
      for (const product of products) {
        const mockProduct = new Product(product);
        new CartProduct({ amount: mockProduct.price, productId: mockProduct.id, cartId: mockUser.cart.id });
        mockUser.cart.products.push(mockProduct);
      }

      const userFindByPkSpy = jest.spyOn(User, 'findByPk').mockResolvedValue(mockUser);
      const orderFindByPkSpy = jest.spyOn(Order, 'findByPk').mockResolvedValue(mockOrder);
      const orderSaveSpy = jest.spyOn(mockOrder, 'save').mockResolvedValue(mockOrder);
      const paymentFindOneSpy = jest.spyOn(Payment, 'findOne').mockResolvedValue(mockPayment);
      const paymentSaveSpy = jest.spyOn(mockPayment, 'save').mockResolvedValue(mockPayment);
      const cartProductFindAllSpy = jest.spyOn(CartProduct, 'findAll');
      const cartProductDestroySpy = jest.spyOn(CartProduct, 'destroy').mockResolvedValue(0);

      await service.actualizePayment('success', mockOrderId);

      expect(orderFindByPkSpy).toHaveBeenCalledWith(mockOrderId);
      expect(mockOrder.state).toEqual(OrderStateEnum.PAGO);
      expect(orderSaveSpy).toHaveBeenCalled();
      expect(paymentFindOneSpy).toHaveBeenCalledWith({ where: { orderId: mockOrderId } });
      expect(mockPayment.state).toEqual(PaymentState.SUCCESS);
      expect(paymentSaveSpy).toHaveBeenCalled();
      expect(userFindByPkSpy).toBeCalledWith(mockUser.id, { include: [ ShoppingCart ] });
      expect(cartProductFindAllSpy).toHaveBeenCalledWith({ where: { cartId: mockUser.cart.id } });
      expect(cartProductDestroySpy).toHaveBeenCalledWith({ where: { cartId: mockUser.cart.id } });
    });

    it('should update the order and payment states for a failure payment', async () => {
      const mockOrder = new Order(order);
      const mockPayment = new Payment();
      const mockOrderId = order.id;

      const orderFindByPkSpy = jest.spyOn(Order, 'findByPk').mockResolvedValue(mockOrder);
      const orderSaveSpy = jest.spyOn(mockOrder, 'save').mockResolvedValue(mockOrder);
      const paymentFindOneSpy = jest.spyOn(Payment, 'findOne').mockResolvedValue(mockPayment);
      const paymentSaveSpy = jest.spyOn(mockPayment, 'save').mockResolvedValue(mockPayment);
      await service.actualizePayment('failure', mockOrderId);

      expect(orderFindByPkSpy).toHaveBeenCalledWith(mockOrderId);
      expect(mockOrder.state).toEqual(OrderStateEnum.RECHAZADO);
      expect(orderSaveSpy).toHaveBeenCalled();

      expect(paymentFindOneSpy).toHaveBeenCalledWith({ where: { orderId: mockOrderId } });
      expect(mockPayment.state).toEqual(PaymentState.FAILED);
      expect(paymentSaveSpy).toHaveBeenCalled();
    });

    it('should update the order and payment states for a pending payment', async () => {
      const mockOrder = new Order(order);
      const mockPayment = new Payment();
      const mockOrderId = order.id;

      const orderFindByPkSpy = jest.spyOn(Order, 'findByPk').mockResolvedValue(mockOrder);
      const orderSaveSpy = jest.spyOn(mockOrder, 'save').mockResolvedValue(mockOrder);
      const paymentFindOneSpy = jest.spyOn(Payment, 'findOne').mockResolvedValue(mockPayment);
      const paymentSaveSpy = jest.spyOn(mockPayment, 'save').mockResolvedValue(mockPayment);

      await service.actualizePayment('pending', mockOrderId);

      expect(orderFindByPkSpy).toHaveBeenCalledWith(mockOrderId);
      expect(mockOrder.state).toEqual(OrderStateEnum.PENDIENTE);
      expect(orderSaveSpy).toHaveBeenCalled();

      expect(paymentFindOneSpy).toHaveBeenCalledWith({ where: { orderId: mockOrderId } });
      expect(mockPayment.state).toEqual(PaymentState.PENDING);
      expect(paymentSaveSpy).toHaveBeenCalled();
    });

  });
});
