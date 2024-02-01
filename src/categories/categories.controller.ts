import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthAdminUser } from 'src/auth/decorators/auth-admin-user.decorator';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guarg';
import { IResponse } from 'src/utils/interfaces/response.interface';
import { IGetAllCategories } from './interfaces/categoriesResponse.interface';
import { CreateBrandDto } from 'src/brands/dto/create-brand.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @HttpCode(200)
  @Get()
  async IgetAllCategories(): Promise<IGetAllCategories> {
    const categories = await this.categoriesService.findAllCategories();
    return {
      statusCode: 200,
      categories,
    };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Post()
  async bulkCreateCategories(
    @AuthAdminUser() _user: void,
    @Body('url') url: string,
  ): Promise<IResponse> {
    await this.categoriesService
      .getSheetsData(url)
      .then(async (data: GoogleSpreadsheet) => {
        return await this.categoriesService.spreadSheetsToJSON(data);
      })
      .then(async (data: { name: string }[]) => {
        return await this.categoriesService.postInDatabase(data);
      });
    return {
      statusCode: 201,
      message: 'Categorías creadas con éxito!',
    };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Post('one')
  async createCategori(
    @AuthAdminUser() _user: void,
    @Body('name') name: string,
  ): Promise<IResponse> {
    await this.categoriesService.createOneCategory(name);
    return {
      statusCode: 201,
      message: 'La Categoría se creo con éxito!',
    };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Patch()
  async updateCategoryName(
    @AuthAdminUser() _user: void,
    @Body() cateogry: CreateBrandDto,
  ): Promise<IResponse> {
    await this.categoriesService.updateCategoryName(cateogry);
    return {
      statusCode: 204,
    };
  }
}
