import { IResponse } from 'src/utils/interfaces/response.interface';
import { Product } from '../entities/product.entity';

export interface IGetOneProduct extends IResponse {
  product: Product;
}
