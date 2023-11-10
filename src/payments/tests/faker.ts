import { faker } from '@faker-js/faker';
import { OrderStateEnum } from '../../orders/entities/order.entity';
import { stateproduct } from '../../products/entities/product.entity';
import { PaymentState } from '../entities/payment.entity';

export const createUserObject = () => {
  const userId = faker.string.uuid();
  const user = {
    userId,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    id: faker.string.uuid(),
    username: faker.word.words(),
    email: faker.internet.email(),
    password: 'daspokdas.',
    phone: faker.phone.number(),
    rol: 'user',
    isActive: true,
    directions: faker.location.city(),
  };
  return user;
};

export const createProductsObject = (number: number) => {
  const products = [];
  while (number > 0) {
    const product = {
      id: faker.string.uuid(),
      title: faker.string.alpha(),
      description: faker.lorem.words(),
      state: stateproduct.Nuevo,
      stock: 0,
      availability: 3,
      price: faker.number.int(5000),
      image: [faker.image.url()],
      model: faker.string.alpha(),
      year: faker.string.numeric(),
    };
    products.push(product);
    number--;
  }
  return products;
};

export const createOrderObject = (products: [], user: any) => {
  const total = products.reduce((acc, { price }) => {
    return acc + price;
  }, 0);
  const order = {
    id: faker.string.uuid(),
    userId: user.id,
    state: OrderStateEnum.PENDIENTE,
    user: user,
    products,
    total,
  };
  return order;
};

export const createPaymentObject = (
  id: string,
  amount: number,
  orderId: string,
  user_email: string,
) => {
  const payment = {
    id,
    orderId,
    user_email,
    amount,
    state: PaymentState.PENDING,
  };
  return payment;
};
