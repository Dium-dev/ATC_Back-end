import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingCartService } from '../shopping-cart.service';
import { ShoppingCart } from '../entities/shopping-cart.entity';
import { SequelizeModule, getModelToken } from '@nestjs/sequelize';
import { faker } from '@faker-js/faker';
import { generatesCartProduct, generatesProduct, generatesShoppingCartInstance } from './faker';
import { BadRequestException, InternalServerErrorException, NotFoundException, forwardRef } from '@nestjs/common';
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
    let productFound;
    let productId:string;
    let cartId:string;
    let amount:number;
    let findProduct;
    let findCart;
    let createCartProduct;


    beforeEach(() => {
      productId = faker.string.uuid();
      cartId = faker.string.uuid();
      amount = faker.number.int({ min: 1, max:3 }); 
      /* amount`s max value is 3 because stock`s min value equals 5.
      Otherwise it will throw an exception (Check shoppingCartService) */

      //productFound is returned here for assertion purposes
      findProduct = jest.spyOn(productModel, 'findByPk').mockImplementation( (id:string, options) => {
        productFound = generatesProduct(id, stateproduct.Active);
        return productFound;
      });

      findCart = jest.spyOn(shoppingCartModel, 'findByPk').mockImplementation( (id) => {
        return true;
      });

      createCartProduct = jest.spyOn(cartProductModel, 'create').mockImplementation( data => {
        return generatesCartProduct(data);
      });
    });

    it('Must add a new product to the shoppingCart', async () => {

      const result = await service.postProductInCart(productId, cartId, amount );

      expect(findProduct).toReturnWith(productFound);
      expect(findCart).toBeCalledWith(cartId);
      expect(createCartProduct).toBeCalledWith({ amount, cartId, productId });
      expect(result).toEqual({ statusCode: 200, message: 'Producto agregado con exito!' });
      

    });

    it('Must throw an exception when the product to add is not found', async () => {
      findProduct.mockReset();
      findProduct.mockImplementation(() => false);
      
      await expect(async () => {
        await service.postProductInCart(productId, cartId, amount );
      })
        .rejects.toThrow(NotFoundException);

      expect(findProduct).toBeCalled();
    });

    it('Must throw an exception when the product to add is inactive', async () => {
      findProduct.mockReset();
      findProduct.mockImplementation( (id:string, options) => {
        productFound = generatesProduct(id, stateproduct.Inactive);
        return productFound;
      });

      await expect(async () => {
        await service.postProductInCart(productId, cartId, amount );
      })
        .rejects.toThrow(NotFoundException);

      expect(findProduct).toBeCalled();
    });

    it('Must throw an exception when amount parameter is greater than the product`s stock', async () => {

      await expect(async () => {
        await service.postProductInCart(productId, cartId, 15 );
      })
        .rejects.toThrow(BadRequestException);

      expect(findProduct).toBeCalled();
    });

    it('Must throw an exception when the ShoppingCart is not found', async () => {
      findCart.mockReset();
      findCart.mockImplementation(() => false);

      await expect(async () => {
        await service.postProductInCart(productId, cartId, amount );
      })
        .rejects.toThrow(NotFoundException);

      expect(findCart).toBeCalled();
    });

    it('Must throw an exception when creating a cartProduct`s instance is not possible', async () => {
      createCartProduct.mockReset();
      createCartProduct.mockImplementation(() => {
        throw new Error();
      });

      await expect(async () => {
        await service.postProductInCart(productId, cartId, amount );
      })
        .rejects.toThrow(InternalServerErrorException);

      expect(createCartProduct).toBeCalled();
    });
  });
});
