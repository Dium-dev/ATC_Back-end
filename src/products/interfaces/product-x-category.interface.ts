import { stateproduct } from '../entities/product.entity';

export interface IItemsProducXcategory {
  id: string;
  title: string;
  state: stateproduct;
  price: number;
  image: string[];
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
