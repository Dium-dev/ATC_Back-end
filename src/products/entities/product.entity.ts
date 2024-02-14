import {
  Column,
  Model,
  Table,
  DataType,
  BelongsTo,
  ForeignKey,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { Brand } from '../../brands/entities/brand.entity';
import { Categories } from '../../categories/entities/category.entity';
import { Order } from '../../orders/entities/order.entity';
import { OrderProduct } from '../../orders/entities/orderProduct.entity';
import { CartProduct } from '../../shopping-cart/entities/cart-product.entity';
import { ShoppingCart } from '../../shopping-cart/entities/shopping-cart.entity';
import { User } from 'src/users/entities/user.entity';
import { UserProductFav } from 'src/orders/entities/userProductFav.entity';
import { FavProduct } from 'src/orders/entities/favProduct.entity';
import { Image } from 'src/products/entities/image.entity';

export enum StateProduct {
  Active = 'Activo',
  Inactive = 'Inactivo',
}

export enum ConditionProduct {
  Nuevo = 'Nuevo',
  Remanufacturado = 'Remanufacturado',
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
    type: DataType.ENUM(...Object.values(StateProduct)),
    allowNull: false,
  })
  state: StateProduct;

  @Column({
    type: DataType.ENUM(...Object.values(ConditionProduct)),
    allowNull: false,
  })
  condition: ConditionProduct;

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
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  mostSelled?: boolean;

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

  @HasMany(() => Image, {})
  images: Image[];

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

  @BelongsToMany(() => UserProductFav, () => FavProduct)
  favCont: UserProductFav[];
}
