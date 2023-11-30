import { Op } from 'sequelize';

interface IWhereProducts {
  id: { [Op.not]: null };
  title?: { [Op.iLike]: string };
  state?: { [Op.iLike]: string };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
interface whereCategoriandBrandId {
  id: { [Op.not]: null } | { [Op.eq]: string } | object;
}

interface whereInOrders {
  state: { [Op.or]: { [Op.eq]: string }[] }
}

export interface IQuery {
  limit: number;
  page?: number;
  offset: number;
  order: string[][];
  where?: whereInOrders,
  whereProduct?: IWhereProducts;
  whereCategoryId?: whereCategoriandBrandId;
  whereBrandId?: whereCategoriandBrandId;
}
