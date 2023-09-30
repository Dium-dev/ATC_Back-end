import { Module } from '@nestjs/common';
import { DirectionsService } from './directions.service';
import { DireetionsController } from './directions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Direction } from './entities/direction.entity';

@Module({
  imports: [SequelizeModule.forFeature([Direction])],
  controllers: [DireetionsController],
  providers: [DirectionsService],
})
export class DireetionsModule {}
