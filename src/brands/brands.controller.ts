import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { Brand } from './entities/brand.entity';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  async getAllCategories(): Promise<Brand[]> {
    const brands = await this.brandsService.findAllBrands();
    return brands;
  }
}
