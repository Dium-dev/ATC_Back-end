import { Module, forwardRef } from '@nestjs/common';
import { DirectionsService } from './directions.service';
import { DireetionsController } from './directions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Direction } from './entities/direction.entity';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    SequelizeModule.forFeature([Direction]),
  ],
  controllers: [DireetionsController],
  providers: [DirectionsService /* UsersService */],
  exports: [DirectionsService],
})
export class DirectionsModule {}
