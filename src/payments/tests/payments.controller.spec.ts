import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from '../payments.controller';
import { PaymentsService } from '../payments.service';
import { MailModule } from '../../mail/mail.module';
import { Response } from 'express';
import { DatabaseModule } from '../../database/database.module';
import { createOrderObject, createProductsObject, createUserObject } from './faker';
import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';
import { Payment, PaymentState } from '../entities/payment.entity';
import { ShoppingCart } from '../../shopping-cart/entities/shopping-cart.entity';
import { Product } from '../../products/entities/product.entity';
import { CartProduct } from '../../shopping-cart/entities/cart-product.entity';

describe('PaymentsController', () => {
  let paymentsController: PaymentsController;
  let paymentsService: PaymentsService;
  let user: any;
  let products: any;
  let order: any;


  beforeEach(async () => {
    user = createUserObject();
    products = createProductsObject(3);
    order = createOrderObject(products, user);
    const module: TestingModule = await Test.createTestingModule({
      imports: [MailModule, DatabaseModule],
      controllers: [PaymentsController],
      providers: [PaymentsService],
    }).compile();

    paymentsController = module.get<PaymentsController>(PaymentsController);
    paymentsService = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(paymentsController).toBeDefined();
    expect(paymentsService).toBeDefined();
  });

  describe('POST: payments/create-payments', () => {
    it('should create a payment and return a URL with valid JWT', async () => {
      const mockUser = new User(user);
      const mockOrder = new Order(order);
      const userFindByPkSpy = jest.spyOn(User, 'findByPk').mockResolvedValue(mockUser);
      const createPaymentSpy = jest.spyOn(paymentsService, 'createPayment');
      const userId = mockUser.id; // Reemplaza con un ID de usuario válido
      const createPaymentDto = {
        amount: mockOrder.total, // Reemplaza con un monto válido
        orderId: mockOrder.id, // Reemplaza con un ID de orden válido
      };

      // Simula el comportamiento del método createPayment de tu servicio
      const res: Response = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(), // Agrega status como un objeto simulado
        json: jest.fn(),
      } as any;

      await paymentsController.createPayment({ userId }, createPaymentDto, res);

      expect(userFindByPkSpy).toHaveBeenCalledWith(userId);
      expect(createPaymentSpy).toHaveBeenCalledWith(createPaymentDto.amount, userId, createPaymentDto.orderId);
      expect(res.send).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalledWith(500);
    });

    it('should return a error when payment failed', async () => {
      const mockOrder = new Order(order);
      const userId = 123;
      const createPaymentDto = {
        amount: mockOrder.total,
        orderId: mockOrder.id,
      };
      const createPaymentSpy = jest.spyOn(paymentsService, 'createPayment').mockRejectedValue(new Error());
      const res: Response = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await paymentsController.createPayment({ userId }, createPaymentDto, res);

      expect(createPaymentSpy).toHaveBeenCalledWith(createPaymentDto.amount, userId, createPaymentDto.orderId);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error al crear el pago' });

      createPaymentSpy.mockReset();
    });
  });
  describe('actualizePayments', () => {
    it('GET: payments/success/:orderid', async () => {
      const mockOrder = new Order(order);
      mockOrder.user = new User(user);
      mockOrder.userId = mockOrder.userId;
      const mockPayment = new Payment();

      jest.spyOn(User, 'findByPk').mockResolvedValue(mockOrder.user);
      const OrderFindByPkSpy = jest.spyOn(Order, 'findByPk').mockResolvedValue(mockOrder);
      const OrderSaveSpy = jest.spyOn(mockOrder, 'save').mockResolvedValue(mockOrder);
      const paymentFindOneSpy = jest.spyOn(Payment, 'findOne').mockResolvedValue(mockPayment);
      const paymentSaveSpy = jest.spyOn(mockPayment, 'save').mockResolvedValue(mockPayment);
      mockOrder.user.cart = new ShoppingCart({ userId: mockOrder.user.id });
      mockOrder.user.cart.products = [];
      for (const product of products) {
        const prod = new Product(product);
        new CartProduct({ amount: prod.price, productId: prod.id, cartId: mockOrder.user.cart.id });
        mockOrder.user.cart.products.push(prod);
      }
      const res: Response = {
        redirect: jest.fn(),
      } as any;

      await paymentsController.handleSuccessPayment(mockOrder.id, res);

      expect(OrderFindByPkSpy).toHaveBeenCalledWith(mockOrder.id);
      expect(paymentFindOneSpy).toHaveBeenCalledWith({ where: { orderId: mockOrder.id } });
      expect(paymentSaveSpy).toHaveBeenCalled();
      expect(OrderSaveSpy).toHaveBeenCalled();
      expect(mockPayment.state).toBe(PaymentState.SUCCESS);
      expect(mockOrder.state).toBe('PAGO');
      expect(res.redirect).toBeCalled();
    });

    it('GET: payments/failure/:orderid', async () => {
      new User(user);
      const mockOrder = new Order(order);

      const OrderFindByPkSpy = jest.spyOn(Order, 'findByPk').mockResolvedValue(mockOrder);
      const OrderSaveSpy = jest.spyOn(mockOrder, 'save').mockResolvedValue(mockOrder);

      const res: Response = {
        redirect: jest.fn(),
      } as any;

      await paymentsController.handleFailurePayment(mockOrder.id, res);

      expect(OrderFindByPkSpy).toHaveBeenCalledWith(mockOrder.id);
      expect(OrderSaveSpy).toHaveBeenCalled();
      expect(mockOrder.state).toBe('RECHAZADO');
      expect(res.redirect).toBeCalled();
    });

    it('GET: payments/failure/:orderid', async () => {
      new User(user);
      const mockOrder = new Order(order);

      const OrderFindByPkSpy = jest.spyOn(Order, 'findByPk').mockResolvedValue(mockOrder);
      const OrderSaveSpy = jest.spyOn(mockOrder, 'save').mockResolvedValue(mockOrder);

      const res: Response = {
        redirect: jest.fn(),
      } as any;

      await paymentsController.handlePendingPayment(mockOrder.id, res);

      expect(OrderFindByPkSpy).toHaveBeenCalledWith(mockOrder.id);
      expect(OrderSaveSpy).toHaveBeenCalled();
      expect(mockOrder.state).toBe('EN PROCESO');
      expect(res.redirect).toBeCalled();
    });
  });
});