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
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review) private reviewModel: typeof Review,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async create(
    id: string,
    createReviewDto: CreateReviewDto,
  ): Promise<IReview | HttpException> {
    try {
      const user = await this.userService.findByPkGenericUser(id, {});

      const Newreview = await this.reviewModel.create({
        ...createReviewDto,
        userId: id,
      });
      if (!Newreview)
        throw new InternalServerErrorException(
          'Algo salió mal al momento de crear la reseña',
        );

      const response = {
        statusCode: 201,
        data: Newreview,
      };
      return response;
    } catch (error) {
      return new HttpException(error.message, error.status);
    }
  }

  async findAll(): Promise<IReview | HttpException> {
    try {
      const reviews = await this.reviewModel.findAll({
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
      return new HttpException(error.message, error.status);
    }
  }

  async update(
    updateReviewDto: UpdateReviewDto,
  ): Promise<IReview | HttpException> {
    try {
      //Update
      const count = await this.reviewModel.update(updateReviewDto, {
        where: {
          id: updateReviewDto.reviewId,
        },
      });

      if (count[0] === 0)
        throw new BadRequestException(
          'No se pudo actualizar la reseña, revisar el id enviado',
        );

      //Get review
      const newReview = await this.reviewModel.findOne({
        include: {
          model: User,
          attributes: ['firstName', 'lastName'],
        },
        attributes: ['review', 'rating', 'updatedOn', 'active'],
        where: {
          id: updateReviewDto.reviewId,
        },
      });

      return { statusCode: 200, data: newReview };
    } catch (error) {
      return new HttpException(error.message, error.status);
    }
  }

  async removeOrActivate(
    activateReviewDto: ActivateReviewDto,
  ): Promise<IReview | HttpException> {
    try {
      const count = await this.reviewModel.update(
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
      return new HttpException(error.message, error.status);
    }
  }
}
