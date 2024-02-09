import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
  Model,
} from 'sequelize-typescript';
import { Product } from 'src/products/entities/product.entity';
import * as fs from 'fs';

export interface IImage {
  id: string;
  localUrl: string;
  productId: string;
}

@Table({
  modelName: 'Image',
  timestamps: false,
  underscored: true,
})
export class Image extends Model implements IImage {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    unique: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  localUrl: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.STRING,
  })
  productId: string;

  @BelongsTo(() => Product)
  product: Product;
}
