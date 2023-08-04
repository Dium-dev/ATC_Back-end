import { Column, Model, Table, DataType } from 'sequelize-typescript';
enum rol {
  superAdmin = 'superAdmin',
  admin = 'admin',
  user = 'user',
}

@Table({
  tableName: 'Users',
  underscored: true,
  timestamps: true,
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
  firtsName: string;

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
    defaultValue: rol.user,
    allowNull: false,
  })
  rol: rol;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  active: boolean;
}
