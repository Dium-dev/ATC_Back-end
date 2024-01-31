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
import { BrandsService } from './brands.service';
import { IGetAllBrands } from './interfaces/brandsResponse.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guarg';
import { AuthAdminUser } from 'src/auth/decorators/auth-admin-user.decorator';
import { IResponse } from 'src/utils/interfaces/response.interface';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { CreateBrandDto } from './dto/create-brand.dto';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) { }

  @Get()
  async getAllCategories(): Promise<IGetAllBrands> {
    const brands = await this.brandsService.findAllBrands();
    return {
      statusCode: 200,
      brands
    };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Post()
  async bulkCreateCategories(
    @AuthAdminUser() _user: void,
    @Body('url') url: string,
  ): Promise<IResponse> {
    await this.brandsService.getSheetsData(url)
      .then(async (data: GoogleSpreadsheet) => {
        return await this.brandsService.spreadSheetsToJSON(data);
      })
      .then(async (data: { name: string }[]) => {
        return await this.brandsService.postInDatabase(data)
      });
    return {
      statusCode: 201,
      message: 'Marcas creadas con éxito!'
    };
  };

  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Post('one')
  async createCategori(
    @AuthAdminUser() _user: void,
    @Body('name') name: string,
  ): Promise<IResponse> {
    await this.brandsService.createOneBrand(name);
    return {
      statusCode: 201,
      message: 'La Marca se creo con éxito!'
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Patch()
  async updateBrandName(
    @AuthAdminUser() _user: void,
    @Body() cateogry: CreateBrandDto,
  ): Promise<IResponse> {
    await this.brandsService.updateBrandName(cateogry);
    return {
      statusCode: 204
    };
  }

}