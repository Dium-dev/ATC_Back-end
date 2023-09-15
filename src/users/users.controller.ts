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
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ICreateUser } from './interfaces/create-user.interface';
import { IResponse } from 'src/utils/interfaces/response.interface';

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
      'Si todo sale bien, se devolverá un objeto con un statusCode 201 y el token de verificación de usuario.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Indica que hubo un error a la hora de crear la cuenta del usuario en la aplicación. Recomendacion verificar los datos enviados',
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
  async signIn(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<ICreateUser | IError> {
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
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IResponse | IError> {
    const response = this.usersService.update(id, updateUserDto);
    return response;
  }
}
