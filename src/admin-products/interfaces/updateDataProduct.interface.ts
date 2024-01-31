import { ConditionProduct, StateProduct } from "src/products/entities/product.entity";

export interface IProduct extends IUpdateDataProduct {
    id: string;
}

export interface IUpdateDataProduct {
    title?: string;
    description?: string;
    state?: StateProduct;
    condition?: ConditionProduct;
    stock?: number;
    price?: number;
    availability?: number;
    mostSelled?: boolean;
    image?: string;
    model?: string;
    year?: string;
    categoryId?: string;
    brandId?: string;
}