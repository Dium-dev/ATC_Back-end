import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-product.dto';
import { Op } from 'sequelize';
import { Brand } from 'src/brands/entities/brand.entity';
import { Categories } from 'src/categories/entities/category.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  async getQueryDB(query: QueryProductsDto): Promise<any> {
    let querys = {
      limit: query.limit,
      page: query.page,
      offset: (query.page - 1) * query.limit,
      order: [],
      whereProduct: { id: { [Op.not]: null } },
      whereCategoryId: { id: {} },
      whereBrandId: { id: {} },
    };

    if (query.name) querys.whereProduct['title'] = { [Op.iLike]: query.name };
    if (query.active)
      querys.whereProduct['active'] = { [Op.iLike]: query.active };
    if (query.order) {
      let thisOrder = query.order.split(' ');
      if (thisOrder[0] === 'NOMBRE') {
        querys.order.push(['title', thisOrder[1]]);
      } else {
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

  async getProducts(querys: any): Promise<{items: any; totalItems: number, totalPages: number, page: number}> {
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
}
