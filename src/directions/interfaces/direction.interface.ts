export interface IDirection {
  id: string;
  codigoPostal: number;
  ciudad: string;
  estado: string;
  calle: string;
  userId: string;
}

export interface IDirections {
  statusCode: number;
  directions: IDirection[];
}
