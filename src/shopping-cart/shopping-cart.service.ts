import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateShoppingCartDto } from './dto/create-shopping-cart.dto';
import { UpdateShoppingCartDto } from './dto/update-shopping-cart.dto';
import { Product, stateproduct } from 'src/products/entities/product.entity';
import { IError } from 'src/utils/interfaces/error.interface';
import { CartProduct } from './entities/cart-product.entity';
import { ShoppingCart } from './entities/shopping-cart.entity';

@Injectable()
export class ShoppingCartService {

    async putProductInCart(productId: string, cartId: string, amount: number) {
        try {
            const thisProductAndPrice: { price: number } | IError = await this.getThisProduct(productId, amount);

            const thisShoppingCart: boolean | IError = await this.getThisShoppingCart(cartId)

            if ('price' in thisProductAndPrice && thisShoppingCart === true) {
                await CartProduct.create({
                    price: thisProductAndPrice.price,
                    amount,
                    productId,
                    cartId,
                });
            }
        } catch (error) {

        }

    }

    private async getThisShoppingCart(id: string): Promise<boolean | IError> {
        try {
            const thisCart = await ShoppingCart.findByPk(id);
            if (!thisCart) throw new NotFoundException('No se ha encontrado el Carrito solicitado.');
            return true;
        } catch (error) {
            switch (error.constructor) {
                case NotFoundException:
                    throw new NotFoundException(error.message);
                default:
                    throw new InternalServerErrorException('Ocurrio un error en el servidor a la hora de consultar el \'Carrito de compras\'.');
            }
        }
    }



    private async getThisProduct(id: string, cantidad: number): Promise<{ price: number } | IError> {
        try {
            const thisProducto = await Product.findByPk(id, { attributes: ['id', 'state', 'stock', 'price'] });
            if (!thisProducto) throw new NotFoundException('No se encontró el producto entre nuestro catalogo de disponibles.');
            if (thisProducto.state === stateproduct.Inactive) throw new NotFoundException('El producto seleccionado no se encuentra disponible para la venta. Consulte en otro momento.');
            if (thisProducto.stock < cantidad) throw new BadRequestException('La cantidad de productos solicitados sobrepasa el Stock disponible en la tienda.');

            return {
                price: (thisProducto.price * cantidad)
            };

        } catch (error) {
            switch (error.constructor) {
                case NotFoundException:
                    throw new NotFoundException(error.message);
                case BadRequestException:
                    throw new BadRequestException(error.message);
                default:
                    throw new InternalServerErrorException('Ocurrio un error en el servidor al tratar de buscar un producto');
            }
        }
    }
}
