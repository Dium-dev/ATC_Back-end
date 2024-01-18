import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserProductFav } from './userProductFav.entity';
import { Product } from 'src/products/entities/product.entity';

@Table({
  tableName: 'favProducts',
  timestamps: false,
})
export class FavProduct extends Model<FavProduct> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true,
  })
  id: string;

  @ForeignKey(() => UserProductFav)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  favContId: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  productId: string;
}
