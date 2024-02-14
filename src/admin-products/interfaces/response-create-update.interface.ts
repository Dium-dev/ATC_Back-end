import { IResponse } from 'src/utils/interfaces/response.interface';

export interface IResponseCreateOrUpdateProducts extends IResponse {
  successful: number;
  errors:
    | {
        index: number;
        reason: string;
      }[]
    | [];
}
