import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from '../reviews.controller';
import { ReviewsService } from '../reviews.service';
import { createUserObject, generateFakeReviewData, newReview } from './faker';
import { UserChangePasswordDto } from '../../auth/dto/user-change-password.dto';
import { CreateReviewDto } from '../dto/create-review.dto';
import { faker } from '@faker-js/faker';

describe('ReviewsController', () => {
  let controller: ReviewsController;
  let service: ReviewsService;

  let user: UserChangePasswordDto;
  let fakeReviewData: CreateReviewDto;
  let review;

  beforeEach(async () => {
    user = createUserObject();
    fakeReviewData = generateFakeReviewData();
    review = newReview(fakeReviewData, user.userId);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        {
          provide: ReviewsService,
          useValue: {
            create: jest.fn().mockImplementation((id, data) => {
              return {
                statusCode: 201,
                data: review,
              };
            }),
            update: jest.fn().mockImplementation((data) => {
              return {
                statusCode: 200,
                data: review,
              };
            }),
            findAll: jest.fn(),
            removeOrActivate: jest.fn((data) => {
              return {
                statusCode: 200,
                data: '1 reseñas fueron actualizadas',
              };
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<ReviewsController>(ReviewsController);
    service = module.get<ReviewsService>(ReviewsService);
  });

  describe('POST:/review', () => {
    it('Must return a successful response', async () => {
      const createReview = jest.spyOn(service, 'create');

      const response = await controller.create(user, fakeReviewData);

      expect(createReview).toBeCalledWith(user.userId, fakeReviewData);
      expect(response).toEqual({ statusCode: 201, data: review });
    });
  });

  describe('GET:/reviews', () => {
    it('Must return an array of reviews', async () => {
      const findReviews = jest
        .spyOn(service, 'findAll')
        .mockImplementationOnce(async () => {
          return {
            statusCode: 200,
            data: [review],
          };
        });

      const response = await controller.findAll();

      expect(findReviews).toBeCalled();
      expect(response).toEqual({ statusCode: 200, data: [review] });
    });
  });

  describe('PATCH:/reviews/update', () => {
    it('Must return the new updated review', async () => {
      const updateReview = jest.spyOn(service, 'update');

      const response = await controller.update({
        reviewId: user.userId,
        ...fakeReviewData,
      });

      expect(updateReview).toBeCalledWith({
        reviewId: user.userId,
        ...fakeReviewData,
      });
      expect(response).toEqual({ statusCode: 200, data: review });
    });
  });

  describe('PATCH:/reviews/activate', () => {
    it('Must update at least one review', async () => {
      const fakeId = faker.string.uuid();
      const activate = faker.datatype.boolean(0.5);
      const removeActivate = jest.spyOn(service, 'removeOrActivate');

      const response = await controller.removeOrActivate({
        reviewId: fakeId,
        activate: activate,
      });

      expect(removeActivate).toBeCalledWith({
        reviewId: fakeId,
        activate: activate,
      });
      expect(response).toEqual({
        statusCode: 200,
        data: '1 reseñas fueron actualizadas',
      });
    });
  });
});
