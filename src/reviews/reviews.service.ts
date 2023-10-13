import {
  BadRequestException,
  HttpException,
  Inject,
  forwardRef,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { User } from 'src/users/entities/user.entity';
import { IReview } from './interfaces/response-review.interface';
import { ActivateReviewDto } from './dto/activate-review.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) { }

  async create(id: string, createReviewDto: CreateReviewDto): Promise<IReview> {
    try {
      const user = await this.userService.findByPkGenericUser(id, {})

      const Newreview = await user.$create('review', createReviewDto);
      if (!Newreview)
        throw new InternalServerErrorException(
          'Algo salió mal al momento de crear la reseña',
        );

      const response = {
        statusCode: 201,
        data: 'Created review successfully',
      };
      return response;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll(): Promise<IReview> {
    try {
      const reviews = await Review.findAll({
        include: {
          model: User,
          attributes: ['firstName', 'lastName'],
        },
        attributes: ['review', 'rating', 'updatedOn', 'active'],
        where: {
          active: true,
        },
      });
      if (!reviews)
        throw new InternalServerErrorException(
          'Algo salió mal al tratar de obtener todas las reseñas',
        );

      if (!reviews.length)
        throw new NotFoundException('No se encontraron reseñas activas');
      return { statusCode: 200, data: reviews };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(updateReviewDto: UpdateReviewDto): Promise<IReview> {
    try {
      //Update
      const count = await Review.update(updateReviewDto, {
        where: {
          id: updateReviewDto.reviewId,
        },
      });
      console.log(count, '<------- count');
      if (count[0] === 0)
        throw new BadRequestException(
          'No se pudo actualizar la reseña, revisar el id enviado',
        );

      //Get review
      const newReview = await Review.findOne({
        include: {
          model: User,
          attributes: ['firstName', 'lastName'],
        },
        attributes: ['review', 'rating', 'updatedOn', 'active'],
        where: {
          id: updateReviewDto.reviewId,
        },
      });

      if (!newReview)
        throw new NotFoundException('No existe una reseña con ese id');

      return { statusCode: 200, data: newReview };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async removeOrActivate(
    activateReviewDto: ActivateReviewDto,
  ): Promise<IReview> {
    try {
      const count = await Review.update(
        { active: activateReviewDto.activate },
        {
          where: {
            id: activateReviewDto.reviewId,
          },
        },
      );

      if (count[0] === 0)
        throw new BadRequestException(
          'Algo salió mal, se sugiere verificar el id enviado',
        );
      return {
        statusCode: 200,
        data: `${count[0]} reseñas fueron actualizadas`,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
