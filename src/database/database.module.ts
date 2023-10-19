import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import * as configEnv from 'src/config/env';
import { Brand } from 'src/brands/entities/brand.entity';
import { Categories } from 'src/categories/entities/category.entity';
import { Direction } from 'src/directions/entities/direction.entity';
import { Order } from 'src/orders/entities/order.entity';
import { OrderProduct } from 'src/orders/entities/orderProduct.entity';
import { Product } from 'src/products/entities/product.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { CartProduct } from 'src/shopping-cart/entities/cart-product.entity';
import { ShoppingCart } from 'src/shopping-cart/entities/shopping-cart.entity';
import { User } from 'src/users/entities/user.entity';
import { Payment } from 'src/payments/entities/payment.entity';

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
        Payment,
      ],
      autoLoadModels: true,
      synchronize: true,
      logging: false,
      sync: { force: true },
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
