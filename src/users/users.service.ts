import { Injectable, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    //private userModel: typeof User,
    private AuthService: AuthService,
  ){}

  @HttpCode(HttpStatus.OK)
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const data = {
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        email: createUserDto.email,
        password: await this.AuthService.generatePassword(createUserDto.password),
        phone: createUserDto.phone
      }

      const newUser = await User.create(data);

      if(newUser) {
        newUser['token'] = await this.AuthService.generateToken(newUser.id, newUser.email)

        return newUser;
      } else {
        throw new Error('Error creating user');
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findOneEmail(email: string) {
    const user = await User.findOne({ where: { email }});

    if(!user) return false;
    else throw new Error('There is already an account created with that email');
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
