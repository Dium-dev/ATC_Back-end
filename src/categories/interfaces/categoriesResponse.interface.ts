import { IResponse } from 'src/utils/interfaces/response.interface';
import { Categories } from '../entities/category.entity';

export interface IGetAllCategories extends IResponse {
  categories: Categories[];
}
