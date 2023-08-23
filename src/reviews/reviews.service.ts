import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { User } from 'src/users/entities/user.entity';
import { IReview } from './interfaces/response-review.interface';
import { ActivateReviewDto } from './dto/activate-review.dto';

@Injectable()
export class ReviewsService {

  async create(id:string, createReviewDto: CreateReviewDto):Promise<IReview> {
    try {
      
      const user = await User.findOne({
        where:{
          id:id,
        },
      });

      if (!user) throw new NotFoundException('No existe un usuario con ese id');

      let Newreview;

      try {
        Newreview = (await user).$create('review', createReviewDto);
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
        throw new BadRequestException('No se pudo crear la reseña!!');
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll():Promise<IReview> {
    try {
      let reviews;

      try {
        reviews = await Review.findAll({
          include:{
            model: User,
            attributes: ['firstName', 'lastName'],
          },
          attributes:[ 'review', 'rating', 'updatedOn', 'active' ],
          where:{
            active: true,
          },
        });
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
     
      if (!reviews.length) throw new NotFoundException('No se encontraron reseñas activas');
      return { statusCode: 200, data: reviews };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(updateReviewDto: UpdateReviewDto):Promise<IReview> {
    try {
      //Update
      try {
        await Review.update(updateReviewDto, {
          where: {
            id: updateReviewDto.reviewId,
          },
        });
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
      
      //Get review
      const newReview = await Review.findOne({
        include: {
          model: User,
          attributes:['firstName', 'lastName'],
        },
        attributes:[ 'review', 'rating', 'updatedOn', 'active' ],
        where:{
          id: updateReviewDto.reviewId,
        },
      });

      if (!newReview) throw new BadRequestException('No existe una reseña con ese id');

      return { statusCode:200, data:newReview };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async removeOrActivate(activateReviewDto: ActivateReviewDto):Promise<IReview> {
    try {
      let count;

      try {
        count = await Review.update({ active: activateReviewDto.activate }, {
          where:{
            id: activateReviewDto.reviewId,
          },
        });
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
      
      if (!count) throw new BadRequestException('Algo salió, se sugiere verificar el id enviado');
      return { statusCode:200, data:`${count} reseñas fueron actualizadas` };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

}
