import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table({ 
  timestamps: false,
  tableName: 'Categories',
})
export class Category extends Model<Category> {

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
    id: string;

  @Column({
    type:DataType.STRING,
    allowNull:false,
    unique:true,
  })
    name:string;
}
