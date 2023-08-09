import { Product } from "../entities/product.entity";

export interface IGetProducts {
  items: Product[];
  totalItems: number;
  totalPages: number;
  page: number;
}
