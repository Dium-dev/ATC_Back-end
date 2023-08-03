import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table
export class Category extends Model {

  @Column({
    type:DataType.STRING,
    allowNull:false,
  })
    name:string;
}