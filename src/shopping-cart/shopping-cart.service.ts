import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Product, stateproduct } from 'src/products/entities/product.entity';
import { IError } from 'src/utils/interfaces/error.interface';
import { CartProduct } from './entities/cart-product.entity';
import { ShoppingCart } from './entities/shopping-cart.entity';

@Injectable()
export class ShoppingCartService {
  public async createCartProduct(userId: string) {
    try {
      const newCartUser = await ShoppingCart.create({ userId });
      return newCartUser;
    } catch (error) {
      switch (error.constructor) {
        default:
          throw new InternalServerErrorException(
            'Ocurrio un error en el servidor. No se pudo crear el carrito de compras a la hora de realizar la creación de su nuevo carrito. intente más tarde.',
          );
      }
    }
  }

  async postProductInCart(
    productId: string,
    cartId: string,
    amount: number,
  ): Promise<{ statusCode: number; message: string }> {
    console.log(productId, cartId, amount);
    const thisProduct: boolean | IError = await this.getThisProduct(
      productId,
      amount,
    );

    const thisShoppingCart: boolean | IError = await this.getThisShoppingCart(
      cartId,
    );

    if (thisProduct === true && thisShoppingCart === true) {
      await CartProduct.create({
        amount,
        productId,
        cartId,
      });
      return {
        statusCode: 200,
        message: 'Producto agregado con exito!',
      };
    }
  }

  private async getThisShoppingCart(id: string): Promise<boolean | IError> {
    try {
      const thisCart = await ShoppingCart.findByPk(id);
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

  private async getThisProduct(
    id: string,
    cantidad: number,
  ): Promise<boolean | IError> {
    try {
      const thisProducto = await Product.findByPk(id, {
        attributes: ['id', 'state', 'stock', 'price'],
      });
      if (!thisProducto)
        throw new NotFoundException(
          'No se encontró el producto entre nuestro catalogo de disponibles.',
        );
      if (thisProducto.state === stateproduct.Inactive)
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
      const cartProductToDelete = await CartProduct.findOne({
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

  async getCartProducts(userId: string) {
    try {
      const thisCart = await ShoppingCart.findOne({
        where: { userId },
        attributes: ['id'],
        include: [{ model: Product, attributes: ['id', 'title', 'price'] }],
      });

      if (!thisCart) {
        throw new NotFoundException(
          'No se encontró el carrito de compras para el usuario.',
        );
      }

      const products = await Promise.all(
        thisCart.products?.map(async (product) => {
          // Aquí obtenemos la cantidad de productos en el carrito para este producto específico
          const cartProduct = await CartProduct.findOne({
            where: {
              cartId: thisCart.id,
              productId: product.id,
            },
          });

          const subtotal = product.price * cartProduct.amount;

          return {
            id: product.id,
            title: product.title,
            price: product.price,
            amount: cartProduct.amount,
            subtotal, // Agregar el subtotal para este producto
          };
        }),
      );

      // Calcula el total como la suma de todos los subtotales
      const total = products.reduce(
        (acc, product) => acc + product.subtotal,
        0,
      );

      return {
        id: thisCart.id,
        products,
        total,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException(
          'Error del servidor al obtener el carrito de compras.',
        );
      }
    }
  }
}
