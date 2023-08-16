import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasOne, Model, Table } from "sequelize-typescript";
import { Product } from "src/products/entities/product.entity";
import { ShoppingCart } from "src/shopping-cart/entities/shopping-cart.entity";
import { User } from "src/users/entities/user.entity";

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

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    userId: string;

    @BelongsTo(() => User)
    user: User;

    @HasOne(() => ShoppingCart)
    shoppginCart: ShoppingCart;
}
