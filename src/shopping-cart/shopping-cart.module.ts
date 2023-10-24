import { Module, forwardRef } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartController } from './shopping-cart.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from 'src/products/entities/product.entity';
import { CartProduct } from './entities/cart-product.entity';
import { ShoppingCart } from './entities/shopping-cart.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    ProductsModule,
    forwardRef(() => UsersModule),
    SequelizeModule.forFeature([CartProduct, ShoppingCart]),
  ],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService],
  exports: [ShoppingCartService, SequelizeModule],
})
export class ShoppingCartModule {}
