
import { Column, Model, DataType, Table } from "sequelize-typescript";

@Table({
    tableName: 'brands',
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

}
