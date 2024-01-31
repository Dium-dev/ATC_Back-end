import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { GetUser } from '../auth/decorators/auth-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guarg';
import { UserChangePasswordDto } from '../auth/dto/user-change-password.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IGetUser } from 'src/auth/interfaces/getUser.interface';

@ApiTags('Shopping cart')
@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) { }

  @ApiOperation({ summary: 'Agregar producto al carrito' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async postProductoInShoppingCart(
    @GetUser() _user: IGetUser,
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
  @UseGuards(JwtAuthGuard)
  @Delete(':cartId/:productId')
  async remove(
    @GetUser() _user: IGetUser,
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
  ) {
    const response = await this.shoppingCartService.remove(cartId, productId);
    return response;
  }

  @ApiOperation({ summary: 'Obtener un carrito por el id del usuario sacado del Token' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getCart(@GetUser() { userId }: IGetUser) {
    const cart = await this.shoppingCartService.getCart(userId);
    return cart;
  }

  @Patch()
  async updateProductQuantity(
    @Body() updateInfo: { cartProductId: string; newQuantity: number },
  ) {
    const response = await this.shoppingCartService.updateProductQuantity(
      updateInfo,
    );
    return response;
  }
}
