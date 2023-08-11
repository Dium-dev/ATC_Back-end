import {
  Controller,
  Get,
  HttpCode,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { IError } from 'src/utils/interfaces/error.interface';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ICreateUser } from './interfaces/create-user.interface';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Ruta para crear la cuenta de un nuevo usuario.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description:
      'Si todo sale bien, se devolverá un objeto con un statusCode 204 y el token de verificación de usuario.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Indica que hubo un error a la hora de crear la cuenta del usuario en la aplicación.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Si el usuario se encuentra registrado, se le solicita que inicie sesión (en una versión posterior seguramente se redireccionara a la ruta de login en el front)',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor.',
  })
  @Post('register')
  @HttpCode(201)
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ICreateUser | IError> {
    return (
      (await this.usersService.verifyEmail(createUserDto.email)) &&
      (await this.usersService.create(createUserDto))
    );
  }

  @Post('login')
  async signIn(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.signIn(loginUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
