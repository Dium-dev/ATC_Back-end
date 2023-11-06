export interface IPurchaseContext {
  name: string;
  products: {
    productName: string;
    price: number;
  }[];
  purchaseDate: string;
  cuotes: number;
  cuotesValue: number;
  total: number;
}
