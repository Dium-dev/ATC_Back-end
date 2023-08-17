import {
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';



export enum Rating {
  zero = '0',
  zeroPoint = '0.5',
  one = '1',
  onePoint = '1.5',
  two = '2',
  twoPoint = '2.5',
  three = '3',
  threePoint = '3.5',
  four = '4',
  fourPoint = '4.5',
  five = '5',
}

@Table({
  tableName: 'Reviews',
  underscored: true,
  timestamps: true,
  paranoid: true,
})
export class Review extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
    id: string;
    
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
    review: string;

  @Column({
    type: DataType.ENUM({
      values: ['0', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'],
    }),
    defaultValue: Rating.zero,
    allowNull: false,
  })
    rating: Rating;
}
