import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const data = {
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        email: createUserDto.email,
        password: await this.authService.generatePassword(
          createUserDto.password,
        ),
        phone: createUserDto.phone,
      };

      const newUser = await this.userModel.create(data);

      if (newUser) {
        const response = {
          id: newUser.id,
          token: await this.authService.generateToken(
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
      console.log({ err: err.message });
    }
  }

  async signIn(loginUserDto: LoginUserDto) {
    try {
      const checkUser = await User.findOne({
        where: { email: loginUserDto.email },
      });
      if (checkUser) {
        const comparePassword = await this.authService.comparePassword(
          loginUserDto.password,
          checkUser.password,
        );

        if (comparePassword) {
          const response = {
            id: checkUser.id,
            rol: checkUser.rol,
            token: await this.authService.generateToken(
              checkUser.id,
              checkUser.email,
            ),
          };

          return response;
        } else {
          throw new Error('Incorrect password');
        }
      } else {
        throw new Error('The email entered does not correspond to any user');
      }
    } catch (err) {
      return { message: err.message };
    }
  }

  findAll() {
    return 'This action returns all users';
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findOneEmail(email: string) {
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return true;
      } else {
        throw new Error('There is already an account created with that email');
      }
    } catch (err) {
      return { message: err.message };
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
    } catch (err) {
      return { message: err.message };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
