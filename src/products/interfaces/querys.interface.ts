import { Op } from 'sequelize';

interface IWhereProducts {
  id: { [Op.not]: null };
  title?: { [Op.iLike]: string };
  state?: { [Op.iLike]: string };
}

interface whereCategoriandBrandId {
  id: { [Op.not]: null } | { [Op.eq]: string } | {};
}

export interface IQuery {
  limit: number;
  page: number;
  offset: number;
  order: string[][];
  whereProduct: IWhereProducts;
  whereCategoryId: whereCategoriandBrandId;
  whereBrandId: whereCategoriandBrandId;
}
