import {IsOptional, IsString, IsEmail} from 'class-validator'


export class UpdateUserDto{
    @IsOptional()
    @IsString()
    firtsName: string

    @IsOptional()
    @IsString()
    lastName: string

    @IsOptional()
    @IsString()
    @IsEmail()
    email: string

    @IsOptional()
    @IsString()
    phone: string
}
