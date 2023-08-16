import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { ShoppingCart } from "./shopping-cart.entity";
import { Product } from "src/products/entities/product.entity";

@Table({
    tableName: 'CartProduct',
    timestamps: true,
    underscored: true,
})
export class CartProduct extends Model<CartProduct> {
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

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    price: number;

    @ForeignKey(() => ShoppingCart)
    @Column
    cartId: string;

    @ForeignKey(() => Product)
    @Column
    productId: string;

}