import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Direction } from '../directions/entities/direction.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { ShoppingCart } from '../shopping-cart/entities/shopping-cart.entity';
import { MailService } from '../mail/mail.service';
import { ShoppingCartModule } from '../shopping-cart/shopping-cart.module';
import { DirectionsModule } from '../directions/directions.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { OrdersModule } from '../orders/orders.module';
import { PaymentsModule } from '../payments/payments.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => ShoppingCartModule),
    forwardRef(() => DirectionsModule),
    forwardRef(() => ReviewsModule),
    forwardRef(() => OrdersModule),
    forwardRef(() => PaymentsModule),
    forwardRef(() => ProductsModule),
    SequelizeModule.forFeature([User, Direction, ShoppingCart]),
  ],
  providers: [UsersService, AuthService, MailService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
