import { faker } from '@faker-js/faker';
import { UserChangePasswordDto } from '../../auth/dto/user-change-password.dto';
import { CreateReviewDto } from '../dto/create-review.dto';
import { Rating } from '../entities/review.entity';

//Generates the kind of user data that is extracted from JWT (check the dto)
export const createUserObject = (): UserChangePasswordDto => {
  return {
    userId: faker.string.uuid(),
    username: faker.internet.email(),
  };
};

//Generates data about a fake review
export const generateFakeReviewData = (
  review = faker.lorem.sentence(),
  rating = Rating.five,
): CreateReviewDto => {
  return {
    review: review,
    rating: rating,
  };
};

//Create false review instance
export const newReview = (review: CreateReviewDto, userId: string) => {
  const fakeReview = {
    review: review.review,
    rating: review.rating,
    id: userId,
    active: true,
    /* creationDate: faker.date.anytime(),
    updatedOn: faker.date.anytime(), */
  };

  return fakeReview;
};
