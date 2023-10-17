import { TestingModule, Test } from '@nestjs/testing';
import { ReviewsService } from 'src/reviews/reviews.service';

describe('Shopping-cartService', () => {
    
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
      ],
    })
      .compile();

    const service = module.get<ReviewsService>(ReviewsService);
  });
});