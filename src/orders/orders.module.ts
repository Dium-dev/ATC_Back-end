import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ShoppingCartModule } from 'src/shopping-cart/shopping-cart.module';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [ShoppingCartModule, PaymentsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
