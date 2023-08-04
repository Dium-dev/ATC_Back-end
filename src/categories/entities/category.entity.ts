import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';
import { Product } from 'src/products/entities/product.entity';

@Table({
  tableName: 'Categories',
  timestamps: false,
})
export class Categories extends Model<Categories> {

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  id: string;

  @HasMany(() => Product)
  products: Product[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;
}
