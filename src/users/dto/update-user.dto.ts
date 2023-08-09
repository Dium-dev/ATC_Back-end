import {IsOptional, IsString, IsEmail} from 'class-validator'


export class UpdateUserDto{
    @IsOptional()
    @IsString()
    firstName: string

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
