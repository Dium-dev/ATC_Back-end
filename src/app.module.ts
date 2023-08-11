import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as dotenv from 'dotenv';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsModule } from './products/products.module';
import { BrandsModule } from './brands/brands.module';
import { DireetionsModule } from './directions/directions.module';
import { CategoriesModule } from './categories/categories.module';
import { Categories } from './categories/entities/category.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { Direction } from './directions/entities/direction.entity';
import { Brand } from './brands/entities/brand.entity';
import { Product } from './products/entities/product.entity';
import { AdminProductsModule } from './admin-products/admin-products.module';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';


dotenv.config();

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DBHOST,
      port: Number(process.env.DBPORT),
      username: process.env.DBUSERNAME,
      password: process.env.DBPASSWORD,
      database: process.env.DBDATABASE,
      models: [Product, User, Categories, Direction, Brand],
      autoLoadModels: true,
      synchronize: true,
      logging: false,
      sync: { force: true },
    }),

    ProductsModule,
    BrandsModule,
    DireetionsModule,
    CategoriesModule,
    UsersModule,
    AdminProductsModule,
    AuthModule,
    CaslModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
