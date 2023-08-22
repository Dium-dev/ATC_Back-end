import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { IReview } from './interfaces/getReviews.interface';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ReviewsService {

  async create(id:string, createReviewDto: CreateReviewDto):Promise<string> {
    try {
      const user = User.findOne({
        where:{
          id:id,
        },
      });
      (await user).$create('review', createReviewDto);
      return 'Created review successfully';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll():Promise<Review[]> {
    try {
      const reviews = await Review.findAll({
        include:{
          model: User,
          attributes: ['firstName', 'lastName'],
        },
        attributes:[ 'review', 'rating', 'updatedOn', 'active' ],
        where:{
          active: true,
        },
      });
      return reviews;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateReviewDto: UpdateReviewDto):Promise<Review> {
    try {
      //Update
      await Review.update(updateReviewDto, {
        where: {
          id: id,
        },
      });
      //Get review
      const newReview = await Review.findOne({
        include: {
          model: User,
          attributes:['firstName', 'lastName'],
        },
        attributes:[ 'review', 'rating', 'updatedOn', 'active' ],
        where:{
          id: id,
        },
      });
      return newReview;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async removeOrActivate(id: string, activate: boolean):Promise<string> {
    try {
      await Review.update({ active: activate }, {
        where:{
          id: id,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    return `This action removes a #${id} review`;
  }

}
