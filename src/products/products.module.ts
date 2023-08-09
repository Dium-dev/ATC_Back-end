import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';
import { Categories } from 'src/categories/entities/category.entity';
import { Brand } from 'src/brands/entities/brand.entity';

@Module({
  imports: [SequelizeModule.forFeature([Product, Categories, Brand])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
