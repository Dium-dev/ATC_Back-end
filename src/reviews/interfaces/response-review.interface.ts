import { Review } from '../entities/review.entity';

export interface IReview {
  statusCode: number,
  data: Review | Review[] | string
}