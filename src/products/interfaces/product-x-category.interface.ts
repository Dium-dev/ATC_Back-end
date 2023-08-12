import { stateproduct } from '../entities/product.entity';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IItems_producXcategory {
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
  items: IItems_producXcategory[];
}
