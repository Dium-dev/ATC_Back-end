import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';
import { Categories } from 'src/categories/entities/category.entity';
import { Brand } from 'src/brands/entities/brand.entity';
import { AdminProductsModule } from 'src/admin-products/admin-products.module';
import { ShoppingCartModule } from 'src/shopping-cart/shopping-cart.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Product, Categories, Brand]),
    forwardRef(() => AdminProductsModule),
    forwardRef(() => ShoppingCartModule),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
