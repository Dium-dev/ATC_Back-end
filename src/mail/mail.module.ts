import { Module, forwardRef } from '@nestjs/common';
import { ContactController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { EMAIL_USER } from '../config/env';
import { transporter } from '../utils/mailer/mailer';
import { join } from 'path';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
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
    forwardRef(() => UsersModule),
    forwardRef(() => MailerModule),
  ],
  controllers: [ContactController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule { }
