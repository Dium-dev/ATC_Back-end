import { Module, forwardRef } from '@nestjs/common';
import { DirectionsService } from './directions.service';
import { DirectionsController } from './directions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Direction } from './entities/direction.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    SequelizeModule.forFeature([Direction]),
  ],
  controllers: [DirectionsController],
  providers: [DirectionsService],
  exports: [DirectionsService],
})
export class DirectionsModule {}
