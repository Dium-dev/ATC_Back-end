import { IResponse } from 'src/utils/interfaces/response.interface';

export interface IDestroyedImagesResponse extends IResponse {
  requested: number;
  total: number;
}
