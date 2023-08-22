import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Patch('activate/:id')
  remove(@Param('id') id: string, @Query('activate') activate:boolean) {
    return this.reviewsService.removeOrActivate(id, activate); 
  }
}
