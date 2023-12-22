import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import * as configEnv from '../config/env';
import { Brand } from '../brands/entities/brand.entity';
import { Categories } from '../categories/entities/category.entity';
import { Direction } from '../directions/entities/direction.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderProduct } from '../orders/entities/orderProduct.entity';
import { Product } from '../products/entities/product.entity';
import { Review } from '../reviews/entities/review.entity';
import { CartProduct } from '../shopping-cart/entities/cart-product.entity';
import { ShoppingCart } from '../shopping-cart/entities/shopping-cart.entity';
import { User } from '../users/entities/user.entity';
import { Payment } from '../payments/entities/payment.entity';
import { UserProductFav } from 'src/orders/entities/userProductFav.entity';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: configEnv.DBHOST,
      port: Number(configEnv.DBPORT),
      username: configEnv.DBUSERNAME,
      password: configEnv.DBPASSWORD,
      database: configEnv.DBDATABASE,
      models: [
        Product,
        User,
        Categories,
        Direction,
        Brand,
        ShoppingCart,
        CartProduct,
        Review,
        Order,
        OrderProduct,
        UserProductFav,
        Payment,
      ],
      autoLoadModels: true,
      synchronize: true,
      logging: false,
      sync: { force: false },
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
