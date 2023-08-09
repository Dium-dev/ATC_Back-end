import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Direction } from '../../directions/entities/direction.entity';

export enum Rol {
  superAdmin = 'superAdmin',
  admin = 'admin',
  user = 'user',
}

@Table({
  tableName: 'Users',
  underscored: true,
  timestamps: true,
  paranoid: true,
})
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.ENUM({
      values: ['superAdmin', 'admin', 'user'],
    }),
    defaultValue: Rol.user,
    allowNull: false,
  })
  rol: Rol;

  @HasMany(() => Direction)
  directions: Direction[];
}
