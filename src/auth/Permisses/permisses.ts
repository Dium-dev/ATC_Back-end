import { Action } from '../../casl/casl-ability.factory/casl-ability.factory';
import { Product } from 'src/products/entities/product.entity';

export const Permisses = {
  CREATE_PRODUCT: { action: Action.Create, subject: Product },
};
