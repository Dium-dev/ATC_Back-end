import { IsString, IsOptional, IsNumber } from "class-validator"

export class UpdateDireetionDto{

    @IsOptional()
    @IsNumber()
    codigoPostal: number

    @IsOptional()
    @IsString()
    ciudad: string

    @IsOptional()
    @IsString()
    estado: string

    @IsOptional()
    @IsString()
    calle: string



}
