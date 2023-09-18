import { Product } from '../entities/product.entity';

export interface IProduct {
  statusCode: number;
  product: Product;
}
