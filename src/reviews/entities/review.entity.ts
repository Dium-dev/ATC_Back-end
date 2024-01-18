import {
  Column,
  DataType,
  BelongsTo,
  Model,
  Table,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';

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
export class Review extends Model<Review> {
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
    type: DataType.ENUM(...Object.values(Rating)), //['0', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'],),
    defaultValue: Rating.zero,
    allowNull: false,
  })
  rating: Rating;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;
}
