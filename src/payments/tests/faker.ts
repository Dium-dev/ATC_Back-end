import { faker } from '@faker-js/faker';
import { OrderStateEnum } from '../../orders/entities/order.entity';
import { Product, stateproduct } from '../../products/entities/product.entity';
import { PaymentState } from '../entities/payment.entity';

export const cache = (key?: string, value?: any, dict = {}) => {
  if (key && value) {
    dict[key] = value;
  } else {
    return dict[key];
  }
};

export const createUserObject = () => {
  const userId = faker.string.uuid();
  cache('userId', userId);

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
  cache('user', user);

  return user;
};

export const createProductsObject = (number: number) => {
  const products = [];

  while (number > 0) {
    const product = {
      id: faker.string.uuid(),
      title: faker.string.alpha(),
      description: faker.lorem.words(),
      state: stateproduct.Active,
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
  cache('products', products);
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

  cache('order', order);

  return order;
};

export const createPaymentObject = (id: string, amount: number, orderId: string, user_email: string) => {

  const payment = {
    id,
    orderId,
    user_email,
    amount,
    state: PaymentState.PENDING,
  };
  cache('payment', payment);

  return payment;
};
