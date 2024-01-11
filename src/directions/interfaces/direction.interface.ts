import { IResponse } from 'src/utils/interfaces/response.interface';
import { Direction } from '../entities/direction.entity';

export interface IResDirection extends IResponse {
  direction?: Direction | Direction[];
}
