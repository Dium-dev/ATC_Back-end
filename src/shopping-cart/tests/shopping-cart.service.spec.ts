import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingCartService } from '../shopping-cart.service';
import { ShoppingCart } from '../entities/shopping-cart.entity';
import { SequelizeModule, getModelToken } from '@nestjs/sequelize';
import { faker } from '@faker-js/faker';
import { NewCartProduct, generateResponse, generatesArrayOfProducts, generatesCartProduct, generatesProduct, generatesShoppingCartInstance } from './faker';
import { BadRequestException, HttpException, InternalServerErrorException, NotFoundException, forwardRef } from '@nestjs/common';
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

  //createCartProduct method -------------------------------------------------------------------
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

  //postProductInCart method--------------------------------------------------------------------
  describe('postProductInCart method', () => {

    //Will be used for assertion purposes
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

      createCartProduct = jest.spyOn(cartProductModel, 'create').mockImplementation( (data: NewCartProduct) => {
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

  describe('remove method', () => {
    let findCartProduct;
    const destroy = jest.fn(() => 'Deleted successfully');
    let cartProductId:string;
    let productId:string;
    
    beforeEach(() => {
      cartProductId = faker.string.uuid();
      productId = faker.string.uuid();

      findCartProduct = jest.spyOn(cartProductModel, 'findOne').mockImplementation(() => {
        return {
          destroy: destroy,
        };
      });

    });

    it('Must remove an specific cartProduct instance from database', async () => {

      const response = generateResponse(204, 'Producto eliminado exitosamente');

      const result = await service.remove(cartProductId, productId);

      expect(findCartProduct).toBeCalledWith({
        where:{
          cartId: cartProductId,
          productId: productId,
        },
      });
      expect(destroy).toBeCalled();
      expect(result).toEqual(response);

    });

    it('Must throw an exception when the carProduct to destroy is not found', async () => {
      findCartProduct.mockReset();
      findCartProduct.mockImplementation(() => undefined);

      await expect(async () => {
        await service.remove(cartProductId, productId);
      }).rejects.toThrow(NotFoundException);
    });
  });

  describe('CreateShoppingCart method', () => {
    let userId:string;
    let createMocked;

    beforeEach(() => {
      userId = faker.string.uuid();
      createMocked = jest.spyOn(shoppingCartModel, 'create').mockImplementation(() => true);
    });

    it('Must create a ShoppingCart instance', async () => {

      const result = await service.CreateShoppingCart(userId, {});

      expect(createMocked).toBeCalledWith({ userId });
      expect(result).toBeUndefined();
    });

    it('Must throw an exception when creating an instance is not possible', async () => {
      createMocked.mockReset();
      createMocked.mockImplementation(() => false);

      await expect(async () => {
        await service.CreateShoppingCart(userId, {});
      }).rejects.toThrow(HttpException);
    });
  });

  describe('destroyShoppingCart', () => {
    let userId;
    let destroyMocked;
    
    beforeEach(() => {
      userId = faker.string.uuid();
      destroyMocked = jest.spyOn(shoppingCartModel, 'destroy').mockImplementation(() => {
        return 1;
      });
    });

    it('Must destroy an specific shoppingCart', async () => {

      const result = await service.destroyShoppingCart(userId, {});

      expect(result).toBeUndefined();
      expect(destroyMocked).toBeCalled();
    });

    it('Must throw an exception when the number of deleted rows equals zero', async () => {
      destroyMocked.mockReset();
      destroyMocked.mockImplementation(() => 0);

      await expect(async () => {
        await service.destroyShoppingCart(userId, {});
      }).rejects.toThrow(HttpException);
    });
  });

  describe('getCart method', () => {

    it('Must find an specific cart and return its associated data', async () => {

      const userId = faker.string.uuid();
      const products = generatesArrayOfProducts(4);
      const total = products.reduce((acc, product) => acc + product.price, 0);
      let newShoppingCart;

      const findShoppingCart = jest.spyOn(shoppingCartModel, 'findOne').mockImplementation((id:string) => {
        newShoppingCart = generatesShoppingCartInstance(id);
        const shoppingCart = {
          ...newShoppingCart,
          products: products,
        };

        return shoppingCart;
      });

      const findCartProduct = jest.spyOn(cartProductModel, 'findOne').mockImplementation(() => {
        const data = {
          amount: 1,
          productId: faker.string.uuid(),
          cartId: faker.string.uuid(),
        };

        return generatesCartProduct(data);
      });


      const result = await service.getCart(userId);

      expect(findShoppingCart).toBeCalled();
      expect(findCartProduct).toBeCalledTimes(products.length);
      expect(result.id).toBe(newShoppingCart.id);
      expect(result.total).toBe(total);
      
      for (const product in products) {
        expect(result.products[product]).toEqual({
          id: products[product].id,
          title: products[product].title,
          price: products[product].price,
          amount: 1,
          subtotal: products[product].price, // Agregar el subtotal para este producto
        });
      }
    });

  });

  describe('getCartProducts method', () => {

    it('Must find an specific cart and return its associated data', async () => {
      const cartId = faker.string.uuid();
      const products = generatesArrayOfProducts(4);
      const total = products.reduce((acc, product) => acc + product.price, 0);
      let newShoppingCart;

      const findShoppingCart = jest.spyOn(shoppingCartModel, 'findByPk').mockImplementation((id:string, options) => {
        newShoppingCart = generatesShoppingCartInstance(id);
        const shoppingCart = {
          ...newShoppingCart,
          products: products,
        };

        return shoppingCart;
      });

      const findCartProduct = jest.spyOn(cartProductModel, 'findOne').mockImplementation(() => {
        const data = {
          amount: 1,
          productId: faker.string.uuid(),
          cartId: faker.string.uuid(),
        };

        return generatesCartProduct(data);
      });

      //Calling the method
      const result = await service.getCartProducts(cartId);

      expect(findShoppingCart).toBeCalled();
      expect(findCartProduct).toBeCalledTimes(products.length);
      expect(result.id).toBe(newShoppingCart.id);
      expect(result.total).toBe(total);

      for (const product in products) {
        expect(result.products[product]).toEqual({
          id: products[product].id,
          title: products[product].title,
          price: products[product].price,
          amount: 1,
          subtotal: products[product].price, // Agregar el subtotal para este producto
        });
      }
    });

    it('Must throw an exception when a ShoppingCart is not found', async () => {
      const cartId = faker.string.uuid();

      const findShoppingCart = jest.spyOn(shoppingCartModel, 'findByPk').mockImplementation((id:string, options) => undefined );

      await expect( async () => {
        await service.getCartProducts(cartId);
      }).rejects.toThrow(NotFoundException);

    });
  });

  describe('updateProductQuantity method', () => {
    it('Must update the specified CartProductUpdate', async () => {
      //For assertions purposes
      const response = generateResponse(200, 'Cantidad de producto actualizada con éxito!');
      const cartProductData = {
        amount: 4, //faker.number.int({ max:4 }), //It can`t be greater than five, otherwise test will fail (check generateProduct method)
        productId: faker.string.uuid(),
        cartId: faker.string.uuid(),
      };
      let cartProduct;
      //Arguments
      const cartProductId = faker.string.uuid();
      const newQuantity = 5;

      const findCartProduct = jest.spyOn(cartProductModel, 'findByPk').mockImplementation(() => {
        cartProduct = {
          ...generatesCartProduct(cartProductData),
          save:jest.fn(async () => 'XD'),
        };

        return cartProduct;
      });
      const findProduct = jest.spyOn(productModel, 'findByPk').mockImplementation(() => {
        return generatesProduct(cartProductData.productId, stateproduct.Active);
      });

      const result = await service.updateProductQuantity({ cartProductId, newQuantity });

      expect(findCartProduct).toBeCalled();
      expect(findProduct).toBeCalled();
      expect(result).toEqual(response);
      expect(cartProduct.amount).toBe(newQuantity);
    });

    it('Must throw an exception when a CartProduct instance can`t be found', async () => {
      const cartProductId = faker.string.uuid();
      const newQuantity = 5;

      const findCartProduct = jest.spyOn(cartProductModel, 'findByPk').mockImplementation(() => false);

      await expect(async () => {
        await service.updateProductQuantity({ cartProductId, newQuantity });
      }).rejects.toThrow(NotFoundException);
    });
  });
});