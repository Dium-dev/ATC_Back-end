import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { BrandsModule } from './brands/brands.module';
import { DireetionsModule } from './directions/directions.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { AdminProductsModule } from './admin-products/admin-products.module';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { MailModule } from './mail/mail.module';
import { ReviewsModule } from './reviews/reviews.module';
import { OrdersModule } from './orders/orders.module';
import { DatabaseModule } from './database/database.module';
import { User } from './users/entities/user.entity';
import { ShoppingCart } from './shopping-cart/entities/shopping-cart.entity';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    ProductsModule,
    BrandsModule,
    DireetionsModule,
    CategoriesModule,
    UsersModule,
    AdminProductsModule,
    AuthModule,
    CaslModule,
    ShoppingCartModule,
    MailModule,
    ReviewsModule,
    OrdersModule,
    DatabaseModule,
    /* SequelizeModule.forFeature([User, ShoppingCart]), */
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
