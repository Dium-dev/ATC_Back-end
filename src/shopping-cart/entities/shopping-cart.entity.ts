import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Product } from "src/products/entities/product.entity";
import { CartProduct } from "./cart-product.entity";
import { Order } from "src/order/entities/order.entity";
import { User } from "src/users/entities/user.entity";

@Table({
    tableName: 'ShoppingCart',
    timestamps: true,
    underscored: true,
})
export class ShoppingCart extends Model<ShoppingCart> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
    })
    id: string;

    @BelongsToMany(() => Product, () => CartProduct)
    products: Product[];

    @ForeignKey(() => Order)
    orderId: string;

    @ForeignKey(() => User)
    userId: string;
}
