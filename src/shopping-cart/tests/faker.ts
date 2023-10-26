import { faker } from '@faker-js/faker';
import { stateproduct } from 'src/products/entities/product.entity';

export const generatesShoppingCartInstance = (userId:string) => {
  return {
    id: faker.string.uuid(),
    userId:userId,
  };
};

export const generatesProduct = (productId:string, state:stateproduct) => {
  return {
    id: productId,
    state: state,
    /*     title: faker.commerce.product(),
    description: faker.commerce.productDescription(), */
    stock: faker.number.int({ min:100 }),
    price: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
  };
};

export const generatesCartProduct = (data) => {
  return {
    id:faker.string.uuid(),
    ...data,
  };
};