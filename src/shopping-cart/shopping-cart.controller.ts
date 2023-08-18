import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';

@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) { }

  @Post()
  async postProductoInShoppingCart(@Body() data: { productId: string, cartId: string, amount: number }) {
    const postThisProduct = await this.shoppingCartService.postProductInCart(data.productId, data.cartId, data.amount);
    return postThisProduct
  }

}
