import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table({ 
  timestamps: false,
})
export class Category extends Model {

  @Column({
    type:DataType.STRING,
    allowNull:false,
  })
    name:string;
}