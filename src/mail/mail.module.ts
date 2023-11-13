import { Module } from '@nestjs/common';
import { ContactController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { EMAIL_USER } from '../config/env';
import { transporter } from '../utils/mailer/mailer';
import { join } from 'path';
import { UpdateOrderDto } from './dto/sendMail.dto';
@Module({
  imports: [
    MailerModule.forRoot({
      transport: transporter,
      defaults: {
        from: EMAIL_USER,
      },
      template: {
        dir: join(__dirname, './templates'),
        adapter: new PugAdapter(),
        options: {
          sticts: true,
        },
      },
    }),
  ],
  controllers: [ContactController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
