import { StateProduct } from '../entities/product.entity';

export interface IItemsProducXcategory {
  id: string;
  title: string;
  state: StateProduct;
  price: number;
  image?:
    | {
        id: string;
        localUrl: string;
        productId: string;
      }[]
    | [];
  category: {
    id: string;
    name: string;
  };
  brand: {
    id: string;
    name: string;
  };
}

export interface IProductXcategory {
  statusCode: number;
  items: IItemsProducXcategory[];
}
