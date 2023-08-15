import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Direction } from '../directions/entities/direction.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    SequelizeModule.forFeature([User, Direction]),
  ],
  providers: [UsersService, AuthService, MailService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
