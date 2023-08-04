import {
  Column,
  Model,
  Table,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Brand } from 'src/brands/entities/brand.entity';
import { Categories } from 'src/categories/entities/category.entity';

enum stateproduct {
  Active = 'Activa',
  Inactive = 'Inactiva',
}

@Table({
  tableName: 'Products',
  timestamps: true,
  underscored: true,
})
export class Product extends Model<Product> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(60),
    allowNull: false,
    validate: {
      len: [1, 60],
    },
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.ENUM(...Object.values(stateproduct)),
    allowNull: false,
  })
  state: stateproduct;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: false,
  })
  stock: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  availability: number;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  image: string[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  model: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  year: string;

  @ForeignKey(() => Brand)
  @Column({
    type: DataType.UUID
  })
  brandId: Brand;

  @BelongsTo(() => Brand, 'brandId')
  brand: Brand;

  @ForeignKey(() => Categories)
  @Column({
    type: DataType.UUID
  })
  categoryId: Categories;

  @BelongsTo(() => Categories)
  category: Categories;

}
