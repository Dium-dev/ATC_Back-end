export interface IPurchaseContext {
  name: string;
  products: {
    productName: string;
    price: number;
  }[];
  purchaseDate: string;
  total: number
}