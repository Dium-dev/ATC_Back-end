import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from '../config/env';
import { JwtStrategy } from './strategy/jwt.strategy';
import { CaslAbilityFactory } from '../casl/casl-ability.factory/casl-ability.factory';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  providers: [AuthService, JwtStrategy, CaslAbilityFactory],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
