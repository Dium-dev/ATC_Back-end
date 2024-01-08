import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from '../reviews.service';
import { createMock } from '@golevelup/ts-jest';
import { Rating, Review } from '../entities/review.entity';
import { getModelToken } from '@nestjs/sequelize';
import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from '../dto/create-review.dto';
import { User } from 'src/users/entities/user.entity';
import { newFakeUser } from './faker';
import { UsersService } from 'src/users/users.service';

const testReview: CreateReviewDto = { review: 'review', rating: Rating.zero };
const testId = 'idDeMentirajaja';

describe('ReviewsService', () => {
  let reviewsService: ReviewsService;
  let review: typeof Review;
  let usersService: UsersService;
  let user: typeof User;
  let createdReview: Review;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: getModelToken(Review),
          useValue: {
            create: jest.fn((newReview) => newReview),
            findAll: jest.fn(() => [testReview]),
            update: jest.fn(),
            findOne: jest.fn(() => testReview),
            destroy: jest.fn((toDestroyReview) => null),
            restore: jest.fn((toRestoreReview) => toRestoreReview),
          },
        },
        {
          provide: getModelToken(User),
          useValue: {
            findOne: jest.fn(() => newFakeUser()),
          },
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    reviewsService = module.get<ReviewsService>(ReviewsService);
    review = module.get<typeof Review>(getModelToken(Review));
    usersService = module.get<UsersService>(UsersService);
    user = module.get<typeof User>(getModelToken(User));
  });

  //Create Method ----------------------------------------------------------
  describe('create method', () => {
    it('Must have called the "create" method with the passed in data', async () => {
      const { create } = review;
      await reviewsService.create(testId, testReview);
      expect(create).toHaveBeenCalled();
    });

    it('Must return a review and a 201 status code', async () => {
      const newReview = await reviewsService.create(testId, testReview);

      expect(newReview).toHaveProperty('statusCode');
      expect(newReview).toHaveProperty('data');
    });

    it('Must throw an exception when creating a Review is not possible', async () => {
      //review.create = () => undefined;

      jest.spyOn(review, 'create').mockImplementation(() => {
        throw new Error();
      });
      try {
        expect(await reviewsService.create(testId, testReview)).toThrowError;
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error).toHaveProperty(
          'message',
          'Algo salió mal al momento de crear la reseña',
        );
      }
    });
  });

  //findAll method ---------------------------------------------------------
  describe('findAll method', () => {
    it('Must return an array of reviews', async () => {
      const result = await reviewsService.findAll();

      expect(review.findAll).toBeCalled();
      expect(result).toHaveProperty('data', [testReview]);
    });

    it('Must throw an exception with a status 404 code when there are not reviews', async () => {
      jest.spyOn(review, 'findAll').mockImplementation(async () => {
        throw new NotFoundException();
      });
      try {
        await reviewsService.findAll();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error).toHaveProperty('status', 404);
        expect(error).toHaveProperty(
          'message',
          'No se encontraron reseñas activas.',
        );
      }
    });

    it('Must return an exception with a 500 status code when is not possible to get reviews', async () => {
      jest.spyOn(review, 'findAll').mockImplementation(async () => {
        throw new InternalServerErrorException();
      });

      try {
        await reviewsService.findAll();
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error).toHaveProperty('status', 500);
        expect(error).toHaveProperty(
          'message',
          'No ha sido posible trabajar en este momento con las reseñas.',
        );
      }
    });
  });

  //Update method ----------------------------------------------------------
  describe('Update method', () => {
    it('Must return a new updated review', async () => {
      jest.spyOn(review, 'update').mockImplementationOnce(async () => [1]);
      const findOne = jest.spyOn(review, 'findOne');

      const result = await reviewsService.update({
        ...testReview,
        reviewId: testId,
      });

      expect(findOne).toHaveBeenCalled();
      expect(result).toHaveProperty('data', testReview);
      expect(result).toHaveProperty('statusCode', 200);
    });

    it('Must return an exception with 400 status code when updating isn`t possible', async () => {
      const update = jest
        .spyOn(review, 'update')
        .mockImplementationOnce(async () => [0]);

      try {
        await reviewsService.update({
          ...testReview,
          reviewId: testId,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error).toHaveProperty(
          'response',
          'No se pudo actualizar la reseña, revisar el id enviado',
        );
        expect(error).toHaveProperty('status', 400);
      }
    });
  });

  //removeOrActivate method ------------------------------------------------
  describe('removeOrActivate method', () => {
    it('must return a message when his review has been updated as inactive', async () => {
      jest.spyOn(review, 'destroy').mockImplementationOnce(async () => null);

      const response = await reviewsService.removeOrActivate({
        reviewId: testId,
        activate: false,
      });
      expect(response).toHaveProperty('statusCode', 200);
      expect(response).toHaveProperty(
        'message',
        'se actualizó el estado de su reseña a inactiva',
      );
    });

    it('must return a message when his review has been updated as active', async () => {
      jest.spyOn(review, 'restore').mockImplementationOnce(async () => {});

      const response = await reviewsService.removeOrActivate({
        reviewId: testId,
        activate: true,
      });
      expect(response).toHaveProperty('statusCode', 200);
      expect(response).toHaveProperty(
        'message',
        'se actualizó el estado de su reseña a activa',
      );
    });

    it('Must return an exception when updating isn`t possible', async () => {
      const update = jest
        .spyOn(review, 'update')
        .mockImplementationOnce(async () => {
          throw new Error();
        });

      try {
        const result = await reviewsService.removeOrActivate({
          reviewId: testId,
          activate: true,
        });
      } catch (error) {
        expect(update).toBeCalled();
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error).toHaveProperty('status', 500);
        expect(error).toHaveProperty(
          'message',
          'Ocurrió un error al actualizar el estado de su reseña \nIntente más tarde',
        );
      }
    });
  });
});
