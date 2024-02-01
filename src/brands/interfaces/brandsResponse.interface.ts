import { IResponse } from 'src/utils/interfaces/response.interface';
import { Brand } from '../entities/brand.entity';

export interface IGetAllBrands extends IResponse {
  brands: Brand[];
}
