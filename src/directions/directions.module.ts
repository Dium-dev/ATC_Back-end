import { Module } from '@nestjs/common';
import { DireetionsService } from './directions.service';
import { DireetionsController } from './directions.controller';

@Module({
  controllers: [DireetionsController],
  providers: [DireetionsService]
})
export class DireetionsModule {}
