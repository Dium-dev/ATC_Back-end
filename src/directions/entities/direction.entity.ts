import {
  Column,
  Model,
  DataType,
  Table,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import { Order } from 'src/orders/entities/order.entity';
@Table({
  tableName: 'Directions',
  timestamps: true,
  underscored: true,
  paranoid: true,
  hooks: {
    async afterCreate(instance: Direction, { transaction }) {
      if (!instance.phone) {
        const thisPhoneNumber = await User.findByPk(instance.userId, {
          transaction,
        });
        instance.phone = thisPhoneNumber.phone;
        await instance.save({ transaction });
      }
    },
  },
})
export class Direction extends Model<Direction> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  city: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  district: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  addressReference?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  neighborhood?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone?: string;

  @HasMany(() => Order)
  orders: Order[];

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;
}
