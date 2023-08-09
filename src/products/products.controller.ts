import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-product.dto';
import { IGetProducts } from './interfaces/getProducts.interface';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  async getProducts(
    @Query() queryProducts: QueryProductsDto,
  ): Promise<IGetProducts> {
    let queryBD = await this.productsService.getQueryDB(queryProducts);
    return await this.productsService.getProducts(queryBD);
  }

  @Get('principales/:categoryName')
  async getProductsXCategory(
    @Param('categoryName') category: string
  ): Promise<any> {
    const findCategory: boolean = await this.productsService.existCategoty(category)
    if (findCategory) {
      return await this.productsService.getProductsXCategory(category)
    } else {
      return findCategory
    }
  }

}
