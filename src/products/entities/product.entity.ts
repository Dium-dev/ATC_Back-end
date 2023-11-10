import {
  Column,
  Model,
  Table,
  DataType,
  BelongsTo,
  ForeignKey,
  BelongsToMany,
} from 'sequelize-typescript';
import { Brand } from '../../brands/entities/brand.entity';
import { Categories } from '../../categories/entities/category.entity';
import { Order } from '../../orders/entities/order.entity';
import { OrderProduct } from '../../orders/entities/orderProduct.entity';
import { CartProduct } from '../../shopping-cart/entities/cart-product.entity';
import { ShoppingCart } from '../../shopping-cart/entities/shopping-cart.entity';

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum stateproduct {
  Nuevo = 'Nuevo',
  Usado = 'Usado',
}

@Table({
  tableName: 'Products',
  timestamps: true,
  underscored: true,
})
export class Product extends Model<Product> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true,
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
    type: DataType.FLOAT,
    allowNull: false,
  })
    price: number;

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
    allowNull: true,
  })
    model: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
    year: string;

  @ForeignKey(() => Brand)
  @Column({
    type: DataType.UUID,
  })
    brandId: string;

  @BelongsTo(() => Brand, 'brandId')
    brand: Brand;

  @ForeignKey(() => Categories)
  @Column({
    type: DataType.UUID,
  })
    categoryId: string;

  @BelongsTo(() => Categories)
    category: Categories;

  @BelongsToMany(() => ShoppingCart, () => CartProduct)
    products: ShoppingCart[];

  @BelongsToMany(() => Order, () => OrderProduct)
    order: Order[];
}
