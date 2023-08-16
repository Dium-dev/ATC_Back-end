import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from '../config/env';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { CaslAbilityFactory } from '../casl/casl-ability.factory/casl-ability.factory';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    //Both authModule and UsersModule refers each other.
    forwardRef(() => UsersModule),
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  providers: [AuthService, JwtStrategy, CaslAbilityFactory, MailService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
