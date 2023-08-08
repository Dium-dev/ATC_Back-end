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

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(
    @Query() queryProducts: QueryProductsDto,
  ): Promise<{
    items: any;
    totalItems: number;
    totalPages: number;
    page: number;
  }> {
    let queryBD = await this.productsService.getQueryDB(queryProducts);
    return await this.productsService.getProducts(queryBD);
  }
}
