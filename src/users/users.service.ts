import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    try {

      const user = await User.findByPk(id);

      if (user) {
         
          if (updateUserDto.firtsName) {
              user.firtsName = updateUserDto.firtsName;
          }
          if (updateUserDto.lastName) {
              user.lastName = updateUserDto.lastName;
          }
          if(updateUserDto.email){
          user.email = updateUserDto.email;
          }

          if(updateUserDto.password){
            user.password = updateUserDto.password;

          }

          if(updateUserDto.phone){
            user.phone = updateUserDto.phone;

          }

          await user.save();

          return user; 
      } else {

          throw new Error('Usuario no encontrado');

      }
  } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      throw error; 
  }

  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
