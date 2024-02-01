import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from '../../products/entities/product.entity';
import { CartProduct } from './cart-product.entity';
import { User } from '../../users/entities/user.entity';

@Table({
  tableName: 'ShoppingCart',
  timestamps: true,
  underscored: true,
  hooks: {
    async beforeDestroy(instance: ShoppingCart) {
      await CartProduct.destroy({
        where: { cartId: instance.id },
        force: true,
      });
    },
  },
})
export class ShoppingCart extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true,
  })
  id: string;

  @BelongsToMany(() => Product, () => CartProduct)
  products: Product[];

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  userId?: string;

  @BelongsTo(() => User)
  user: User;
}
