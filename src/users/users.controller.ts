import {
  Controller,
  Get,
  HttpCode,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ICreateUser } from './interfaces/create-user.interface';
import { IResponse } from 'src/utils/interfaces/response.interface';
import { User } from './entities/user.entity';
import { GetUser } from 'src/auth/auth-user.decorator';
import { IGetUser } from 'src/auth/interefaces/getUser.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guarg';

@ApiTags('Users')
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
      'Si todo sale bien, se devolverá un objeto con un statusCode 201 y el token de verificación de usuario.',
  })
  /* 
    Dejo comentado éste debido a que en la funcion crear usuario deja de estar el 400 de error 
    en la creacion x datos del usuario, quedando con el 500 nomás.
    los datos del ususario se validan en el DTO !
  */
  /* @ApiResponse({
    status: 400,
    description:
      'Indica que hubo un error a la hora de crear la cuenta del usuario en la aplicación. Recomendacion verificar los datos enviados',
  }) */
  @ApiResponse({
    status: 409,
    description:
      'Si el usuario se encuentra registrado, se le solicita que inicie sesión (en una versión posterior seguramente se redireccionara a la ruta de login en el front)',
  })
  @ApiResponse({
    status: 500,
    description: 'Erron interno del servidor, intente mas tarde',
  })
  @Post('register')
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto): Promise<ICreateUser> {
    const newUser = await this.usersService
      .verifyEmail(createUserDto.email)
      .then(async () => {
        return this.usersService.create(createUserDto);
      });
    return newUser;
  }

  @ApiOperation({
    summary: 'Ruta para inicio de sesión de usuarios.',
  })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 201,
    description:
      'Si todo sale bien, se devolverá un objeto con un statusCode 200 y el token de verificación de usuario.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Indica que hubo un error con los datos enviados o estos no se encontraron',
  })
  @ApiResponse({
    status: 401,
    description:
      'Si el usuario ingresa una password o correo invalidos, se le solicita que verifique sus datos.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor.',
  })
  @Post('login')
  @HttpCode(200)
  async signIn(@Body() loginUserDto: LoginUserDto): Promise<ICreateUser> {
    const response = await this.usersService.signIn(loginUserDto);
    return response;
  }

  @ApiOperation({
    summary: 'Ruta para actualizacion de datos del usuario.',
  })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 204,
    description:
      'Si todo sale bien, se devolverá un mensaje con un statusCode 204, indicando que todo estuvo bien, pero sin devolver contenido.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Indica que hubo un error con el id enviado, debido a que, no pertenece a ningun usuario.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor.',
  })
  @ApiParam({
    name: 'id',
    description: 'id del usuario a modificar',
    type: 'string',
  })
  @HttpCode(204)
  @Patch(':id')
  async update(
    @GetUser() { userId }: IGetUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IResponse> {
    const response = this.usersService.update(userId, updateUserDto);
    return response;
  }

  @ApiOperation({
    summary:
      'Ruta para ver todos los usuarios (enviar "page" y "limit" por query).',
  })
  @Get()
  getUsers(@Query('page') page: string, @Query('limit') limit: string) {
    return this.usersService.getAll(+page, +limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getUSersProfile(@GetUser() { userId }: IGetUser): Promise<User> {
    const thisUser = await this.usersService.findProfileUser(userId);
    return thisUser;
  }

  @ApiOperation({
    summary: 'Ruta para eliminar un usuario.',
  })
  @Delete()
  deleteUser(@GetUser() { userId }: IGetUser) {
    return this.usersService.deleteUser(userId);
  }
}
