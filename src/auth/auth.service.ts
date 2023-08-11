import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async generatePassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async generateToken(userId: string, userEmail: string): Promise<string> {
    const token = await this.jwtService.signAsync({
      sub: userId,
      username: userEmail,
    });
    return token;
  }

  async comparePassword(
    receivePassword: string,
    savedPassword: string,
  ): Promise<boolean> {
    const checkPassword = await bcrypt.compare(receivePassword, savedPassword);
    return checkPassword;
  }

  async recoverPassword(recoverPassword: RecoverPasswordDto): Promise<string> {
    try {
      const { email } = recoverPassword;
      const user = await this.usersService.findOneByEmail(email);

      //aca iria la implementacion de la creacion y el envio del
      //token y el correo con el link del formulario para cambiar la contraseña

      return 'Se ha enviado el correo de verificación con el token.';
    } catch (error) {
      switch (error.constructor) {
        case BadRequestException:
          throw new BadRequestException(error.message);
        default:
          throw new InternalServerErrorException('Error interno del servidor');
      }
    }
  }

  async resetPassword(resetPassword: ResetPasswordDto): Promise<string> {
    try {
      const { resetPasswordToken, password } = resetPassword;

      //modificar con nueva implementacion
      //const user = await this.usersService.findUserByResetPasswordToken(
      // resetPasswordToken,
      //);

      //user.password = await this.generatePassword(password);
      //user.resetPasswordToken = null;
      //user.save();
      return 'El cambio de la contraseña fue exitoso.';
    } catch (error) {
      switch (error.constructor) {
        case BadRequestException:
          throw new BadRequestException(error.message);
        default:
          throw new InternalServerErrorException('Error interno del servidor');
      }
    }
  }

  async changePassword(changePassword: ChangePasswordDto, user: User) {
    try {
      const { oldPassword, newPassword } = changePassword;
      const validatePassword = await this.comparePassword(
        oldPassword,
        user.password,
      );

      if (validatePassword) {
        user.password = await this.generatePassword(newPassword);
        user.save();
        return 'El cambio de la contraseña fue exitoso.';
      } else {
        throw new BadRequestException(
          'La contraseña actual recibida no corresponde con la guardada en la aplicación',
        );
      }
    } catch (error) {
      switch (error.constructor) {
        case BadRequestException:
          throw new BadRequestException(error.message);
        default:
          throw new InternalServerErrorException('Error interno del servidor');
      }
    }
  }
}
