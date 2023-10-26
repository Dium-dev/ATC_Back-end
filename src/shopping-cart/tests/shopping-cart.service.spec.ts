import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingCartService } from '../shopping-cart.service';
import { ShoppingCart } from '../entities/shopping-cart.entity';
import { SequelizeModule, getModelToken } from '@nestjs/sequelize';
import { faker } from '@faker-js/faker';
import { generatesCartProduct, generatesProduct, generatesShoppingCartInstance } from './faker';
import { InternalServerErrorException, forwardRef } from '@nestjs/common';
import { Product, stateproduct } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { CartProduct } from '../entities/cart-product.entity';
import { createMock } from '@golevelup/ts-jest';

describe('ShoppingCartService', () => {
  let service: ShoppingCartService;
  let shoppingCartModel;
  let productModel;
  let cartProductModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        forwardRef(() => UsersModule),
        SequelizeModule.forFeature([CartProduct, ShoppingCart, User, Product]),
      ],
      providers: [
        ShoppingCartService,
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<ShoppingCartService>(ShoppingCartService);
    shoppingCartModel = module.get<typeof ShoppingCart>(getModelToken(ShoppingCart));
    productModel = module.get<typeof Product>(getModelToken(Product));
    cartProductModel = module.get<typeof CartProduct>(getModelToken(CartProduct));

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCartProduct method', () => {
    it('Must create a new ShoppingCart instance from a userId and return that instance', async () => {
      const userId = faker.string.uuid();
      const newShoppingCart = generatesShoppingCartInstance(userId);
      const mockedFunction = jest.spyOn(shoppingCartModel, 'create').mockImplementationOnce( id => {
        return newShoppingCart;
      });

      const result = await service.createCartProduct(userId);

      expect(mockedFunction).toBeCalledWith({ userId });
      expect(result).toEqual(newShoppingCart);
    });

    it('Must throw an internal server exception when somethin goes wrong', async () => {
      const userId = faker.string.uuid();
      jest.spyOn(shoppingCartModel, 'create').mockImplementationOnce(() => {
        throw new Error();
      });

      await expect(async () => {
        await service.createCartProduct(userId);
      },
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('postProductInCart method', () => {
    let productId:string;
    let cartId:string;
    let amount:number;


    beforeEach(() => {
      productId = faker.string.uuid();
      cartId = faker.string.uuid();
      amount = faker.number.int({ min: 1, max:99 }); 
      //amount`s max value is 99 because stock equals 100.
      //Otherwise it will throw an exception (Check shoppingCartService)

    });


    it('Must add a new product to the shoppingCart', async () => {
      let productFound;

      //productFound is returned here for assertion purposes
      const findProduct = jest.spyOn(productModel, 'findByPk').mockImplementationOnce( (id:string, options) => {
        productFound = generatesProduct(id, stateproduct.Active);
        return productFound;
      });
      const findCart = jest.spyOn(shoppingCartModel, 'findByPk').mockImplementationOnce( (id) => {
        return true;
      });
      const createCartProduct = jest.spyOn(cartProductModel, 'create').mockImplementationOnce( data => {
        return generatesCartProduct(data);
      });

      const result = await service.postProductInCart(productId, cartId, amount );

      expect(findProduct).toReturnWith(productFound);
      expect(findCart).toBeCalledWith(cartId);
      expect(createCartProduct).toBeCalledWith({ amount, cartId, productId });
      expect(result).toEqual({ statusCode: 200, message: 'Producto agregado con exito!' });
      

    });
  });
});
