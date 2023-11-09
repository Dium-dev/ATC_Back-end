import { faker } from '@faker-js/faker';
import { stateproduct } from 'src/products/entities/product.entity';

export interface NewCartProduct {
  amount: number;
  productId: string;
  cartId: string;
}

export const generatesShoppingCartInstance = (userId: string) => {
  return {
    id: faker.string.uuid(),
    userId: userId,
  };
};

export const generatesProduct = (productId, state: stateproduct) => {
  return {
    id: productId,
    state: state,
    title: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    stock: faker.number.int({ min: 5, max: 10 }),
    price: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
  };
};

export const generatesArrayOfProducts = (amount: number) => {
  const arrayOfProducts = [];

  while (amount > 0) {
    const productId = faker.string.uuid();
    arrayOfProducts.push(generatesProduct(productId, stateproduct.Active));
    --amount;
  }

  return arrayOfProducts;
};

export const generatesCartProduct = (data: NewCartProduct) => {
  return {
    id: faker.string.uuid(),
    ...data,
  };
};

export const generateResponse = (status: number, message: string) => {
  return {
    statusCode: status,
    message: message,
  };
};
