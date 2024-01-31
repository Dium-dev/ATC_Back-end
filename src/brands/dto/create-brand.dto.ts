import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { IBrandsData } from "../interfaces/brandsData.interface";

export class CreateBrandDto implements IBrandsData {
    @IsNotEmpty({ message: 'La propiedad $property no debe estar vacia.' })
    @IsUUID("4", { message: 'La propiedad $property debe ser del tipo UUID V4.' })
    id: string;

    @IsNotEmpty({ message: 'La propiedad $property no debe estar vacia.' })
    @IsString({ message: 'La propiedad $property debe ser del tipo string.' })
    name: string;
}
