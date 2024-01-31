import { ExecutionContext } from '@nestjs/common';
import { IsEnum, IsNotEmpty, IsPositive, Validate } from 'class-validator';

enum EOrderGetUsers {
  firstNameAsc = 'firstName ASC',
  firstNameDesc = 'firstName DESC',
  lastNameAsc = 'lastName ASC',
  lastNameDesc = 'lastName DESC',
  emailAsc = 'email ASC',
  emailDesc = 'email DESC',
}

export class PaginateUsersDto {
  @IsNotEmpty({ message: 'La propiedad $property, no debe ser nula.' })
  page: string;

  @IsNotEmpty({ message: 'La propiedad $property, no debe ser nula.' })
  limit: string;

  @IsNotEmpty({
    message: 'La propiedad $property, debe contener un tipo de orden.',
  })
  @IsEnum(EOrderGetUsers, {
    message: `Puede contener las propiedades "${Object.values(
      EOrderGetUsers,
    )}"`,
  })
  order: EOrderGetUsers;
}
