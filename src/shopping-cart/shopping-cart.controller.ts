import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
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
  @ApiResponse({
    status: 404,
    description: 'No se encontró el registro de CartProduct',
  })
  @Delete(':cartId/:productId')
  async remove(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
  ) {
    const response = await this.shoppingCartService.remove(cartId, productId);
    return response;
  }

<<<<<<<<< Temporary merge branch 1


  @ApiOperation({ summary: 'Actualizar la cantidad de un producto en el carrito' })
  @ApiResponse({
    status: 200,
    description: 'Cantidad de producto actualizada con éxito',
  })
  @ApiResponse({ status: 500, description: 'Error del servidor' })
  @ApiResponse({ status: 404, description: 'No se encontró el registro de CartProduct' })
  @Patch(':userId/products/:productId')
  async updateProductQuantity(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Body() data: { newQuantity: number },
  ) {
    const { newQuantity } = data;
    const response = await this.shoppingCartService.updateProductQuantity(
      userId,
      productId,
      newQuantity,
    );
    return response;
=========
  @Get(':userId')
  async getCartProducts(@Param('userId') userId: string) {
    const thisShoppingCart = await this.shoppingCartService.getCartProducts(
      userId,
    );
    return thisShoppingCart;
>>>>>>>>> Temporary merge branch 2
  }
}


