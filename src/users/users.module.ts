import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Direction } from 'src/directions/entities/direction.entity';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [SequelizeModule.forFeature([User, Direction])],
  providers: [UsersService, AuthService],
  controllers: [UsersController],
})
export class UsersModule {}
