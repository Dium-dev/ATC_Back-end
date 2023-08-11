import { Controller, Patch, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetUser } from './get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
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
    description: 'Se ha enviado el correo de verificación con el token.',
  })
  @ApiResponse({
    status: 400,
    description: 'El usuario no se encuentra registrado en la aplicación.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor.',
  })
  @Patch('recover-password')
  recoverPassword(@Body() recoverPassword: RecoverPasswordDto): Promise<any> {
    return this.authService.recoverPassword(recoverPassword);
  }

  @ApiOperation({
    summary:
      'Ruta para cambiar la contraseña por olvido. Recibe la nueva contraseña del usuario y el token enviado al correo.',
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
  @Patch('reset-password')
  resetPassword(@Body() resetPassword: ResetPasswordDto): Promise<void> {
    return this.authService.resetPassword(resetPassword);
  }

  @ApiOperation({
    summary:
      'Ruta para cambiar la contraseña actual del usuario. Recibe la contraseña actual y la nueva contraseña que se desea guardar.',
  })
  @ApiBody({ type: ChangePasswordDto })
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
  @Patch('change-password')
  //aca va el Guard
  changePassword(
    @Body() changePassword: ChangePasswordDto,
      @GetUser() user: User,
  ): Promise<void> {
    return this.authService.changePassword(changePassword, user);
  }
}
