import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { BrandsModule } from './brands/brands.module';
import { DirectionsModule } from './directions/directions.module';
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
import { PaymentsModule } from './payments/payments.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ProductsModule,
    BrandsModule,
    DirectionsModule,
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
    PaymentsModule,
    MailerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
