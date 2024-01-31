import { ConditionProduct, StateProduct } from "src/products/entities/product.entity";
import { IProduct } from "../interfaces/updateDataProduct.interface";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateProductDto implements IProduct {
    @IsNotEmpty({ message: 'La propiedad $property no debe estar vacía.' })
    @IsString({ message: 'Debe ser el $property del producto a modificar.' })
    id: string;

    @IsOptional()
    title?: string;

    @IsOptional()
    description?: string;

    @IsOptional()
    @IsEnum(StateProduct, { message: `La propiedad $property solo puede ser completada con: ${Object.values(StateProduct)}` })
    state?: StateProduct;

    @IsOptional()
    @IsEnum(ConditionProduct, { message: `La propiedad $property solo puede ser completada con: ${Object.values(ConditionProduct)}` })
    condition?: ConditionProduct;

    @IsOptional()
    stock?: number;

    @IsOptional()
    price?: number;

    @IsOptional()
    availability?: number;

    @IsOptional()
    mostSelled?: boolean;

    @IsOptional()
    image?: string;

    @IsOptional()
    model?: string;

    @IsOptional()
    year?: string;

    @IsOptional()
    categoryId?: string;

    @IsOptional()
    brandId?: string;
}