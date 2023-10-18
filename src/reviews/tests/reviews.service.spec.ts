import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from '../reviews.service';
import { createMock } from '@golevelup/ts-jest';
import { Rating, Review } from '../entities/review.entity';
import { getModelToken } from '@nestjs/sequelize';
import { HttpException } from '@nestjs/common';
import { CreateReviewDto } from '../dto/create-review.dto';

const testReview: CreateReviewDto = { review:'review', rating: Rating.zero };
const testId = 'idDeMentirajaja';

describe('ReviewsService', () => {
  let reviewsService: ReviewsService;
  let review: typeof Review;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide:getModelToken(Review),
          useValue:{
            create:jest.fn( newReview => newReview),
            findAll:jest.fn(() => [testReview]),
            update:jest.fn(),
            findOne:jest.fn(() => testReview),
          },
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    reviewsService = module.get<ReviewsService>(ReviewsService);
    review = module.get<typeof Review>(getModelToken(Review));
  });

  //Create Method ----------------------------------------------------------
  describe('create method', () => {

    it('Must have called the "create" method with the passed in data', 
      async () => {
        const { create } = review;
        await reviewsService.create(testId, testReview);

        expect(create).toBeCalledWith({ ...testReview, userId:testId });
      },
    );

    it('Must return a review and a 201 status code',
      async () => {

        const iReview = {
          data: {
            ...testReview,
            userId: testId,
          },
          statusCode:201,
        };

        const newReview = await reviewsService.create(testId, testReview);

        expect(newReview).toEqual(iReview);

      },
    );

    it('Must throw an exception when creating a Review is not possible', 
      async () => {
        //review.create = () => undefined;
        jest.spyOn(review, 'create').mockReset();

        const result = await reviewsService.create(testId, testReview);

        expect(result).toBeInstanceOf(HttpException);
        expect(result).toHaveProperty('response', 'Algo salió mal al momento de crear la reseña');
        expect(result).toHaveProperty('status', 500);
      },
    );
  });

  //findAll method ---------------------------------------------------------
  describe('findAll method', () => {
    it('Must return an array of reviews', async () => {

      const result = await reviewsService.findAll();

      expect(review.findAll).toBeCalled();
      expect(result).toHaveProperty('data', [testReview]);
    });

    it('Must return an exception with a 404 status code when there are not reviews', async () => {
      jest.spyOn(review, 'findAll').mockImplementationOnce(async () => {
        return [];
      });

      const result = await reviewsService.findAll();

      expect(result).toBeInstanceOf(HttpException);
      expect(result).toHaveProperty('status', 404);
    });

    it('Must return an exception with a 500 status code when is not possible to get reviews',
      async () => {
        jest.spyOn(review, 'findAll').mockReset();

        const result = await reviewsService.findAll();

        expect(result).toBeInstanceOf(HttpException);
        expect(result).toHaveProperty('status', 500);
      },
    );
  });

  //Update method ----------------------------------------------------------
  describe('Update method', () => {

    it('Must return an exception with 400 status code when updating isn`t possible', 
      async () => {
        const update = jest.spyOn(review, 'update').mockImplementationOnce(async () => [0]);

        const result = await reviewsService.update({ ...testReview, reviewId: testId });

        expect(update).toHaveBeenCalledWith(
          { ...testReview, reviewId: testId },
          {
            where: {
              id: testId,
            },
          },
        );
        expect(result).toBeInstanceOf(HttpException);
        expect(result).toHaveProperty('response', 'No se pudo actualizar la reseña, revisar el id enviado');
        expect(result).toHaveProperty('status', 400);

      });

    it('Must return a new updated review', async () => {
      jest.spyOn(review, 'update').mockImplementationOnce(async () => [1]);
      const findOne = jest.spyOn(review, 'findOne');

      const result = await reviewsService.update({ ...testReview, reviewId: testId });

      expect(findOne).toHaveBeenCalled();
      expect(result).toHaveProperty('data', testReview);
      expect(result).toHaveProperty('statusCode', 200);
    });
  });

  //removeOrActivate method ------------------------------------------------
  describe('removeOrActivate method', () => {

    it('Must return an exception when updating isn`t possible', async () => {
      const update = jest.spyOn(review, 'update').mockImplementationOnce( async () => [0]);

      const result = await reviewsService.removeOrActivate({ reviewId: testId, activate:true });

      expect(update).toBeCalled();
      expect(result).toBeInstanceOf(HttpException);
      expect(result).toHaveProperty('response', 'Algo salió mal, se sugiere verificar el id enviado');
      expect(result).toHaveProperty('status', 400);
    });
  });
});
