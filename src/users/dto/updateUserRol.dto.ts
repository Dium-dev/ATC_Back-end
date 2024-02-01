import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { Rol } from '../entities/user.entity';
import { IUpdateUserRol } from '../interfaces/updateUserRol.interface';

export class UpdateUserRolDto implements IUpdateUserRol {
  @IsNotEmpty({ message: 'La propiedad $property no debe estar vacia' })
  @IsUUID('4', { message: 'La pripiedad $property debe ser de tipo UUID V4' })
  id: string;
  @IsNotEmpty({ message: 'La propiedad $property no debe estar vacia' })
  @IsEnum(Rol, {
    message: `La pripiedad $property debe contener alguno de los siguientes valores: ${Object.values(
      Rol,
    )}`,
  })
  rol: Rol;
}
