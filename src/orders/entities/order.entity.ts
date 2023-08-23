
import {
    Column,
    DataType,
    HasMany,
    Model,
    Table,
  } from 'sequelize-typescript';
  import { Product } from 'src/products/entities/product.entity';
  
  @Table({
    tableName: 'Order',
    timestamps: true,
    underscored: true,
  })
  export class Order extends Model<Order> {
    @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    })
      id: string;
  
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 1,
    })
      amount: number;
  
  
      @HasMany(() => Product)
    products: Product[];
}