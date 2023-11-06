import { User } from '../entities/user.entity';

export interface GenericPaginateUserInt {
  data: User[];
  page: number;
  totalPages: number;
  totalUsers: number;
}
