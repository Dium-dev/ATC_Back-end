import { Column, Model, DataType, Table, HasMany } from 'sequelize-typescript';
import { Product } from '../../products/entities/product.entity';

@Table({
  tableName: 'Brands',
  timestamps: false,
  underscored: true,
})
export class Brand extends Model<Brand> {
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
  })
  name: string;
}
