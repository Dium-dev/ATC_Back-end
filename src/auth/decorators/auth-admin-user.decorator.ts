import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Rol, User } from 'src/users/entities/user.entity';
import { IGetUser } from '../interfaces/getUser.interface';

export const AuthAdminUser = createParamDecorator(
  async (_data: unknown, context: ExecutionContext): Promise<void> => {
    const req = context.switchToHttp().getRequest();
    const dataUser = req.user;
    const requestPath = req.path;
    const requestMethod = req.method;

    console.log(requestMethod + '\n' + requestPath);

    if (
      requestPath.includes('/admin-products') ||
      (requestPath.includes('/users') && requestMethod == 'PATCH')
    ) {
      await validateAdminUser(dataUser, Rol.superAdmin);
    } else {
      await validateAdminUser(dataUser, Rol.admin);
    }

    return;
  },
);

const validateAdminUser = async (
  user: IGetUser,
  requestRol: Rol,
): Promise<void> => {
  try {
    const thisUser = await User.findByPk(user.userId, { attributes: ['rol'] });
    if (requestRol == Rol.superAdmin) {
      if (
        thisUser.rol !== Rol.user &&
        thisUser.rol == user.rol &&
        thisUser.rol == requestRol
      ) {
        return;
      } else {
        throw new UnauthorizedException();
      }
    } else {
      if (
        thisUser.rol !== Rol.user &&
        thisUser.rol == user.rol &&
        (thisUser.rol == requestRol || thisUser.rol == Rol.superAdmin)
      ) {
        return;
      } else {
        throw new UnauthorizedException();
      }
    }
  } catch (error) {
    switch (error.constructor) {
      case UnauthorizedException:
        throw new UnauthorizedException(
          'Tipo de usuario no autorizado para realizar esta operación',
        );
      default:
        throw new InternalServerErrorException(
          'Ocurrio un error en el servidor al verificar el tipo de usuario.',
        );
    }
  }
};
