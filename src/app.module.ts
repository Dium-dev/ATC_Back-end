import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as dotenv from 'dotenv';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsModule } from './products/products.module';
import { BrandsModule } from './brands/brands.module';
import { DireetionsModule } from './directions/directions.module';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';
import { UsersModule } from './users/users.module';


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
      models: [Category],
      autoLoadModels: true,
      synchronize: true,
    }),

    ProductsModule,
    BrandsModule,
    DireetionsModule,
    CategoriesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
