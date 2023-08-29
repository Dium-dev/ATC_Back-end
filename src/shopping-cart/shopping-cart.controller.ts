import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @Post()
  async postProductoInShoppingCart(
  @Body() data: { productId: string; cartId: string; amount: number },
  ) {
    const postThisProduct = await this.shoppingCartService.postProductInCart(
      data.productId,
      data.cartId,
      data.amount,
    );
    return postThisProduct;
  }


  @ApiOperation({ summary: 'Eliminar un producto del carrito' })
  @ApiResponse({
    status: 204,
    description: 'Producto eliminado exitosamente',
  })
  @ApiResponse({ status: 500, description: 'Error del servidor' })
  @ApiResponse({ status: 404, description: 'No se encontró el registro de CartProduct' })
 
  @Delete(':cartId/:productId')
async remove(@Param('cartId') cartId: string, @Param('productId') productId: string ){
  const response = await this.shoppingCartService.remove(cartId, productId);
  return response;
}





}
