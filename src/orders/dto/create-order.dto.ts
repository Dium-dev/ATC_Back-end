import { AmountPricePerProduct } from '../interfaces/amount-price-product';

export class CreateOrderDto {
  total: number;

  userId: string;

  products: AmountPricePerProduct[];
}
