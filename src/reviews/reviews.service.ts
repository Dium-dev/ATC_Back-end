import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { User } from 'src/users/entities/user.entity';
import { IReview } from './interfaces/create-review.interface';

@Injectable()
export class ReviewsService {

  async create(id:string, createReviewDto: CreateReviewDto):Promise<IReview> {
    try {
      const user = User.findOne({
        where:{
          id:id,
        },
      });
      const { review, rating } = createReviewDto;

      //Making sure all needed data was received
      if (!review || !rating) throw new BadRequestException('Falta información');

      let Newreview;

      try {
        Newreview = (await user).$create('review', { review, rating });
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }

      
      if (Newreview) {
        const response = {
          statusCode: 201,
          data:'Created review successfully',
        };
        return response;
      } else {
        throw new InternalServerErrorException('Algo salió mal en el servidor!!');
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
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
