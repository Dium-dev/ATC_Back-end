import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    firtsName: string
    lastName: string
    email: string
    password: string
    phone: string
}
