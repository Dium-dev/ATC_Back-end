
import { Column, Model, DataType, Table, HasMany } from "sequelize-typescript";
import { Product } from "src/products/entities/product.entity";

@Table({
    tableName: 'Brands',
    timestamps: true,
    underscored: true
})

export class Brand extends Model<Brand> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
        primaryKey: true
    })
    id: string;

    @Column({
        type: DataType.STRING,
        allowNull:false,
    })
    name: string;

    @HasMany(() => Product)
    products: Product[];

}
