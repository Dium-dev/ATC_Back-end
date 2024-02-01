import { Rol } from 'src/users/entities/user.entity';

export interface IGetUser {
  userId?: string;
  userEmail?: string;
  rol?: Rol;
}
