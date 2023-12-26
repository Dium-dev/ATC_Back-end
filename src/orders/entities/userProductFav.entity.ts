import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from '../../products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';

@Table({})
export class UserProductFav extends Model<UserProductFav> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
    id: string;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
  })
    userId: string;

  @BelongsTo(() => User)
    user: User;

  @ForeignKey(() => Product)
  @Column({
    allowNull: false,
  })
    productId: string;

  @BelongsTo(() => Product)
    product: Product;
}
