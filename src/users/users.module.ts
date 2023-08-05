import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Direction } from 'src/directions/entities/direction.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Direction])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
