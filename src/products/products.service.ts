import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-product.dto';
import { Op } from 'sequelize';
import { Brand } from 'src/brands/entities/brand.entity';
import { Categories } from 'src/categories/entities/category.entity';
import { Product } from './entities/product.entity';
import { IQuery } from './interfaces/querys.interface';
import { IGetProducts } from './interfaces/getProducts.interface';

@Injectable()
export class ProductsService {
  async getQueryDB(query: QueryProductsDto): Promise<IQuery> {
    let querys = {
      limit: query.limit,
      page: query.page,
      offset: (query.page - 1) * query.limit,
      order: [],
      whereProduct: { id: { [Op.not]: null } },
      whereCategoryId: { id: {} },
      whereBrandId: { id: {} },
    };

    if (query.name)
      querys.whereProduct['title'] = { [Op.iLike]: `%${query.name}%` };
    if (query.active) querys.whereProduct['state'] = query.active;
    if (query.order) {
      let thisOrder = query.order.split(' ');
      if (thisOrder[0] === 'NOMBRE') {
        querys.order.push(['title', thisOrder[1]]);
      }
      if (thisOrder[0] === 'PRECIO') {
        querys.order.push(['price', thisOrder[1]]);
      }
    }
    if (query.categoryId) {
      querys.whereCategoryId.id = { [Op.eq]: query.categoryId };
    } else {
      querys.whereCategoryId.id = { [Op.not]: null };
    }
    if (query.brandId) {
      querys.whereBrandId.id = { [Op.eq]: query.brandId };
    } else {
      querys.whereBrandId.id = { [Op.not]: null };
    }

    return querys;
  }

  async getProducts(querys: any): Promise<IGetProducts> {
    const {
      limit,
      offset,
      order,
      whereProduct,
      whereBrandId,
      whereCategoryId,
      page,
    } = querys;

    const { rows: items, count: totalItems } = await Product.findAndCountAll({
      limit,
      offset,
      order,
      attributes: [
        'id',
        'title',
        'state',
        'stock',
        'price',
        'availability',
        'image',
        'model',
        'year',
      ],
      where: whereProduct,
      include: [
        { model: Brand, as: 'brand', where: whereBrandId },
        { model: Categories, as: 'category', where: whereCategoryId },
      ],
    });

    let totalPages = Math.ceil(totalItems / limit);

    return { items, totalItems, totalPages, page };
  }


  async existCategoty(categoryName: string): Promise<boolean> {
    const boleanCategory: number = await Categories.count({ where: { name: { [Op.iLike]: `%${categoryName}%` } } });
    if (boleanCategory) {
      return true;
    };
    return false;
  }

  async getProductsXCategory(categoryName: string): Promise<any> {
    const thisProducts = await Product.findAll({
      limit: 5,
      attributes: ['id', 'title', 'state', 'price', 'image'],
      include: [
        { model: Categories, where: { name: { [Op.iLike]: `%${categoryName}%` } } }
      ]
    });
    return thisProducts;
  }

}
