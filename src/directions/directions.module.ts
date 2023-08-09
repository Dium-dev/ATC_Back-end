import { Module } from '@nestjs/common';
import { DireetionsService } from './directions.service';
import { DireetionsController } from './directions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Direction } from './entities/direction.entity';

@Module({
  imports: [SequelizeModule.forFeature([Direction])],
  controllers: [DireetionsController],
  providers: [DireetionsService],
})
export class DireetionsModule {}
