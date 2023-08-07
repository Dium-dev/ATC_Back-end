import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, Equals } from 'class-validator';

enum Rol {
  superAdmin = 'superAdmin',
  admin = 'admin',
  user = 'user',
}

export class CreateUserDto {

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
    email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
    password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
    firtsName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
    lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
    phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
    rol: string;
}
