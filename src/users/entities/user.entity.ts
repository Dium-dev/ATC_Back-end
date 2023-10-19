import {
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Direction } from '../../directions/entities/direction.entity';
import { ShoppingCart } from '../../shopping-cart/entities/shopping-cart.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Order } from '../../orders/entities/order.entity';

export enum Rol {
  superAdmin = 'superAdmin',
  admin = 'admin',
  user = 'user',
}

@Table({
  tableName: 'Users',
  underscored: true,
  timestamps: true,
  paranoid: true,
  hooks: {
    async beforeDestroy(instance: User) {
      await ShoppingCart.destroy({
        where: { userId: instance.id },
        force: true,
      });
      await Direction.destroy({ where: { userId: instance.id }, force: true });
      await Review.destroy({ where: { userId: instance.id }, force: true });
    },
  },
})
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
    id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    lastName: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
    email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    phone: string;

  @Column({
    type: DataType.ENUM({
      values: ['superAdmin', 'admin', 'user'],
    }),
    defaultValue: Rol.user,
    allowNull: false,
  })
    rol: Rol;

  @Column({})
    isActive: boolean;

  @HasMany(() => Direction, { onDelete: 'CASCADE', hooks: true })
    directions: Direction[];

  @HasOne(() => ShoppingCart, { onDelete: 'CASCADE', hooks: true })
    cart: ShoppingCart;

  @HasOne(() => Review, { onDelete: 'CASCADE', hooks: true })
    review: Review;

  @HasMany(() => Order, { onDelete: 'CASCADE', hooks: true })
    orders: Order;
}
