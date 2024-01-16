import {
  Controller,
  Patch,
  Body,
  HttpCode,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetUser } from './auth-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guarg';
import { UserChangePasswordDto } from './dto/user-change-password.dto';
import { IResponse } from 'src/utils/interfaces/response.interface';
import { IGetUser } from './interefaces/getUser.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary:
      'Ruta para solicitar el cambio de contraseña por olvido. Recibe el email del usuario y le envía un mail con el link de la ruta para cambiar la contraseña, junto con el token para autorizar el cambio.',
  })
  @ApiBody({ type: RecoverPasswordDto })
  @ApiResponse({
    status: 201,
    description:
      'Se ha enviado el correo de verificación con el link para cambiar la contraseña.',
  })
  @ApiResponse({
    status: 400,
    description: 'El usuario no se encuentra registrado en la aplicación.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor.',
  })
  /* auth/recoverPassword */
  @Patch('recoverPassword')
  @HttpCode(201)
  async recoverPassword(
    @Body() recoverPassword: RecoverPasswordDto,
  ): Promise<IResponse> {
    const response = await this.authService.recoverPassword(recoverPassword);
    return response;
  }

  @ApiOperation({
    summary:
      'Ruta para cambiar la contraseña por olvido. Recibe la nueva contraseña del usuario y el token enviado al correo.',
  })
  @ApiHeader({
    name: 'x-token',
    description:
      'Recibe el token que se encuentra en el link de la vista de cambio de contraseña, enviado al correo usuario. Authorization: Bearer token',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 201,
    description: 'El cambio de la contraseña fue exitoso.',
  })
  @ApiResponse({
    status: 400,
    description:
      'El token recibido no corresponde con el enviado al correo del usuario.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor.',
  })
  /* auth/resetPassword */
  @Patch('resetPassword')
  @HttpCode(201)
  async resetPassword(
    @Body() resetPassword: ResetPasswordDto,
      @Headers('x-token') token: string,
      //@GetUser() user: UserChangePasswordDto,
  ): Promise<IResponse> {
    const response = await this.authService.resetPassword(resetPassword, token);
    return response;
  }

  @ApiOperation({
    summary:
      'Ruta para cambiar la contraseña actual del usuario. Recibe la contraseña actual y la nueva contraseña que se desea guardar.',
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiHeader({
    name: 'Authorization',
    description:
      'Recibe el token devuelto cuando el usuario se loguea en la app. Authorization: Bearer token',
  })
  @ApiResponse({
    status: 201,
    description: 'El cambio de la contraseña fue exitoso.',
  })
  @ApiResponse({
    status: 400,
    description:
      'La contraseña actual recibida no corresponde con la guardada en la aplicación.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor.',
  })
  /* auth/changePassword */
  @UseGuards(JwtAuthGuard)
  @Patch('changePassword')
  @HttpCode(201)
  async changePassword(
    @Body() changePassword: ChangePasswordDto,
      @GetUser() user: IGetUser,
  ): Promise<IResponse> {
    const response = await this.authService.changePassword(
      changePassword,
      user,
    );
    return response;
  }
}
