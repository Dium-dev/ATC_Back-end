import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingCartService } from '../shopping-cart.service';
import { ShoppingCartModule } from '../shopping-cart.module';
import { createMock } from '@golevelup/ts-jest';

describe('ShoppingCartService', () => {
  let service: ShoppingCartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ShoppingCartModule,
      ],
      providers: [
        ShoppingCartService,
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<ShoppingCartService>(ShoppingCartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
