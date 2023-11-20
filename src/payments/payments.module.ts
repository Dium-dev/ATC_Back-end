import { Module, forwardRef } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { UsersModule } from 'src/users/users.module';
import { MailService } from 'src/mail/mail.service';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [forwardRef(() => UsersModule), forwardRef(() => OrdersModule)],
  controllers: [PaymentsController],
  providers: [PaymentsService, MailService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
