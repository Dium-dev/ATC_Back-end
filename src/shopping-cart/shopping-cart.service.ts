import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  HttpException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { Product, StateProduct } from '../products/entities/product.entity';
import { CartProduct } from './entities/cart-product.entity';
import { ShoppingCart } from './entities/shopping-cart.entity';
import { FindOptions, Transaction } from 'sequelize';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { ProductsService } from 'src/products/products.service';
import { InjectModel } from '@nestjs/sequelize';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class ShoppingCartService {
  constructor(
    //Injecting shoppingCart model
    @InjectModel(ShoppingCart)
    private shoppingCartModel: typeof ShoppingCart,
    //Injecting CartProduct model
    @InjectModel(CartProduct)
    private cartProductModel: typeof CartProduct,
    //Injecting Product model
    @InjectModel(Product)
    private productModel: typeof Product,
    //Injecting User model
    @InjectModel(User)
    private userModel: typeof User,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    @Inject(forwardRef(() => ProductsService))
    private productsService: ProductsService,
    @Inject(forwardRef(() => OrdersService))
    private ordersService: OrdersService,
  ) {}

  async postProductInCart(
    productId: string,
    cartId: string,
    amount: number,
  ): Promise<{ statusCode: number; message: string }> {
    try {
      const thisProduct: boolean = await this.getThisProduct(productId, amount);

      const thisShoppingCart: boolean = await this.getThisShoppingCart(cartId);

      if (thisProduct && thisShoppingCart) {
        await this.cartProductModel.create({
          amount,
          productId,
          cartId,
        });
        return {
          statusCode: 200,
          message: 'Producto agregado con exito!',
        };
      }
    } catch (error) {
      switch (error.constructor) {
        case NotFoundException:
          throw new NotFoundException(error.message);
        case BadRequestException:
          throw new BadRequestException(error.message);
        default:
          throw new InternalServerErrorException(
            'Ocurrio un error en el servidor al tratar de buscar un producto',
          );
      }
    }
  }

  private async getThisShoppingCart(id: string): Promise<boolean> {
    try {
      const thisCart = await this.shoppingCartModel.findByPk(id);
      if (!thisCart)
        throw new NotFoundException(
          'No se ha encontrado el Carrito solicitado.',
        );
      return true;
    } catch (error) {
      switch (error.constructor) {
        case NotFoundException:
          throw new NotFoundException(error.message);
        default:
          throw new InternalServerErrorException(
            "Ocurrio un error en el servidor a la hora de consultar el 'Carrito de compras'.",
          );
      }
    }
  }

  private async getThisProduct(id: string, cantidad: number): Promise<boolean> {
    try {
      const thisProducto = await this.productsService.findByPkGenericProduct(
        id,
        {
          attributes: ['id', 'state', 'stock', 'price'],
        },
      );
      if (!thisProducto)
        throw new NotFoundException(
          'No se encontró el producto entre nuestro catalogo de disponibles.',
        );
      if (thisProducto.state === StateProduct.Inactive)
        throw new NotFoundException(
          'El producto seleccionado no se encuentra disponible para la venta. Consulte en otro momento.',
        );
      if (thisProducto.stock < cantidad)
        throw new BadRequestException(
          'La cantidad de productos solicitados sobrepasa el Stock disponible en la tienda.',
        );

      return true;
    } catch (error) {
      switch (error.constructor) {
        case NotFoundException:
          throw new NotFoundException(error.message);
        case BadRequestException:
          throw new BadRequestException(error.message);
        default:
          throw new InternalServerErrorException(
            'Ocurrio un error en el servidor al tratar de buscar un producto',
          );
      }
    }
  }

  async remove(cartId: string, productId: string) {
    try {
      const cartProductToDelete = await this.cartProductModel.findOne({
        where: {
          cartId: cartId,
          productId: productId,
        },
      });

      if (cartProductToDelete) {
        await cartProductToDelete.destroy();

        return {
          statusCode: 204,
          message: 'Producto eliminado exitosamente',
        };
      } else {
        throw new NotFoundException(
          'No se encontró el registro de CartProduct',
        );
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException('Error del servidor');
      }
    }
  }

  public async CreateShoppingCart(
    userId: { userId: string },
    transaction: Transaction,
  ): Promise<void> {
    await ShoppingCart.create(userId, { transaction });
    return;
  }

  public async destroyShoppingCart(
    userId: { userId: string },
    transaction: Transaction,
  ): Promise<void> {
    await ShoppingCart.destroy({
      where: userId,
      force: true,
      transaction,
    });
    return;
  }

  async getCart(userId: string) {
    try {
      const cart = await this.shoppingCartModel.findOne({
        where: { userId },
        include: [
          {
            model: Product,
            attributes: ['id', 'title', 'image', 'price'],
            through: { attributes: ['id', 'amount'] },
          },
        ],
      });

      const products = await Promise.all(
        cart.products?.map(async (product) => {
          const subtotal = product.price * product['CartProduct'].amount;

          return {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.images,
            amount: product['CartProduct'].amount,
            subtotal, // Agregar el subtotal para este producto
          };
        }),
      );

      const total = products.reduce(
        (acc, product) => acc + product.subtotal,
        0,
      );

      return {
        id: cart.id,
        products,
        total,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async updateProductQuantity(updateInfo: {
    cartProductId: string;
    newQuantity: number;
  }): Promise<{ statusCode: number; message: string }> {
    try {
      const cartProductToUpdate = await this.cartProductModel.findByPk(
        updateInfo.cartProductId,
      );

      if (!cartProductToUpdate) {
        throw new NotFoundException(
          'No se encontró el registro de CartProduct',
        );
      }

      const thisProduct: boolean = await this.getThisProduct(
        cartProductToUpdate.productId, // Usar el productId de la tabla intermedia
        updateInfo.newQuantity,
      );

      if (thisProduct) {
        cartProductToUpdate.amount = updateInfo.newQuantity;
        await cartProductToUpdate.save();

        return {
          statusCode: 200,
          message: 'Cantidad de producto actualizada con éxito!',
        };
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException(
          'Error del servidor al actualizar la cantidad de producto.',
        );
      }
    }
  }

  public async getCartProductsForNewOrder(
    options: FindOptions,
    products: Product[],
  ) {
    const genericCartPRoducts = await this.cartProductModel.findAll(options);

    const productsResponse = [];
    for (const thisCart of genericCartPRoducts) {
      const thisProduct = products.find(
        (product) =>
          product.id == thisCart.productId &&
          product.state == StateProduct.Active &&
          thisCart.amount <= product.stock,
      );
      if (!thisProduct)
        throw new BadRequestException(
          'Comprueba la cantidad de productos con el stock disponible y verifique si está "Activo" antes de generar una Orden',
        );
      productsResponse.push({
        id: thisProduct.id,
        price: thisProduct.price,
        amount: thisCart.amount,
        subTotal: thisProduct.price * thisCart.amount,
      });
    }

    return {
      total: productsResponse.reduce(
        (sum, product) => sum + product.subTotal,
        0,
      ),
      products: productsResponse,
    };
  }
}
