export interface IUpdateOrderContext {
    order: string;
    name: string;
    phone: string;
    message: string;
    userEmail: string;
    consultationReason: ConsultationReason;
  }
  
  export enum ConsultationReason {
    Envio = 'Envio',
    Producto = 'Producto',
    Pago = 'Pago',
    Otro = 'Otro',
  }