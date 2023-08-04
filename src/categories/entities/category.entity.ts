import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table({ 
  timestamps: false,
  tableName: 'categories',
})
export class Category extends Model<Category> {

  @Column({
    type:DataType.STRING,
    allowNull:false,
    unique:true,
  })
    name:string;
}