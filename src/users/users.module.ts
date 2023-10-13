import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Direction } from '../directions/entities/direction.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { ShoppingCart } from 'src/shopping-cart/entities/shopping-cart.entity';
import { MailService } from 'src/mail/mail.service';
import { ShoppingCartModule } from 'src/shopping-cart/shopping-cart.module';
import { DirectionsModule } from 'src/directions/directions.module';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { OrdersModule } from 'src/orders/orders.module';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => ShoppingCartModule),
    forwardRef(() => DirectionsModule),
    forwardRef(() => ReviewsModule),
    forwardRef(() => OrdersModule),
    forwardRef(() => PaymentsModule),
    SequelizeModule.forFeature([User, Direction, ShoppingCart]),
  ],
  providers: [UsersService, AuthService, MailService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
