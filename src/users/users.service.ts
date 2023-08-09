import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private AuthService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const data = {
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        email: createUserDto.email,
        password: await this.AuthService.generatePassword(
          createUserDto.password,
        ),
        phone: createUserDto.phone,
      };

      const newUser = await this.userModel.create(data);

      if (newUser) {
        const response = {
          id: newUser.id,
          token: await this.AuthService.generateToken(
            newUser.id,
            newUser.email,
          ),
          rol: newUser.rol,
        };

        return response;
      } else {
        throw new Error('Error creating user');
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  findAll() {
    return 'This action returns all users';
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findOneEmail(email: string) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return true;
    } else {
      throw new Error('There is already an account created with that email');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await User.findByPk(id);

      if (user) {
        if (updateUserDto.firstName) {
          user.firstName = updateUserDto.firstName;
        }
        if (updateUserDto.lastName) {
          user.lastName = updateUserDto.lastName;
        }
        if (updateUserDto.email) {
          user.email = updateUserDto.email;
        }

        if (updateUserDto.phone) {
          user.phone = updateUserDto.phone;
        }

        await user.save();

        return user;
      } else {
        throw new Error('Usuario no encontrado');
      }
    } catch (error) {
      throw error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
