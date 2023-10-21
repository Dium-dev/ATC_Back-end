import { Module, forwardRef } from '@nestjs/common';
import { AdminProductsService } from './admin-products.service';
import { AdminProductsController } from './admin-products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from 'src/products/entities/product.entity';
import { Categories } from 'src/categories/entities/category.entity';
import { Brand } from 'src/brands/entities/brand.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Product, Categories, Brand]),
    forwardRef(() => ProductsModule)
  ],
  controllers: [AdminProductsController],
  providers: [AdminProductsService],
  exports: [AdminProductsService]
})
export class AdminProductsModule { }
