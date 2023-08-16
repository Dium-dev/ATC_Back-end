import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShoppingCart } from 'src/shopping-cart/entities/shopping-cart.entity';
import { Order } from './entities/order.entity';

@Module({
  imports: [SequelizeModule.forFeature([Order, ShoppingCart])],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule { }
