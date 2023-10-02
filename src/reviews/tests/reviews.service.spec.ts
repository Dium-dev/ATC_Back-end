import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from '../reviews.service';
import { createMock } from '@golevelup/ts-jest';

describe('ReviewsService', () => {
  let service: ReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  describe('create Review', () => {

  });
});
