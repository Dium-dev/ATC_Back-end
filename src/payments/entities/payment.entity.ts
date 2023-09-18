import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

export enum PaymentState {
  DONE = 'done',
  PENDING = 'pending',
  FAILED = 'failed',
}

@Table({
  tableName: 'Payments',
  underscored: true,
  timestamps: true,
  paranoid: true,
})
export class Payment extends Model<Payment> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  amount: number; // Cantidad de dinero pagada

  //Esto podría cambiar después
  @Column({
    type: DataType.ENUM(...Object.values(PaymentState)),
    allowNull: false,
    defaultValue: PaymentState.PENDING,
  })
  payment_state: PaymentState;

  //Esto puede cambiar después
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  user_email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  link: string; //link del pago

  @CreatedAt
  @Column({
    type: DataType.DATEONLY,
  })
  creationDate: Date;
}
