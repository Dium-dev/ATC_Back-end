import {
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from '../../products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { FavProduct } from './favProduct.entity';

@Table({
  tableName: 'UserProductFav',
  timestamps: false,
  underscored: true,
  hooks: {
    async beforeDestroy(instance: UserProductFav) {
      await FavProduct.destroy({
        where: { favContId: instance.id },
        force: true,
      });
    },
  },
})
export class UserProductFav extends Model<UserProductFav> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true,
  })
    id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
    userId: string;

  @BelongsToMany(() => Product, () => FavProduct)
    products: Product[];
}
