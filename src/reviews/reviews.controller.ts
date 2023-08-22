import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ActivateReviewDto } from './dto/activate-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('/:id')
  create(@Param('id') id:string, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(id, createReviewDto);
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  /* @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  } */

  @Patch('update')
  update(@Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(updateReviewDto);
  }

  @Patch('activate')
  remove(@Body() activateReview: ActivateReviewDto) {
    return this.reviewsService.removeOrActivate(activateReview); 
  }
}
