import { Column, Model, DataType, Table, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';
@Table({
  tableName: 'Directions',
  timestamps: true,
  underscored: true,
  paranoid:true,
})

export class Direction extends Model<Direction> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
    id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    codigoPostal: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    ciudad: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    estado: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    calle: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
    userId: User;
    
  @BelongsTo(() => User)
    user: User;
    
}
