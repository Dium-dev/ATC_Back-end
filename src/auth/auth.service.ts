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
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly mailsService: MailService,
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

  //Para enviar el correo junto con token de recuperación
  async recoverPassword(recoverPassword: RecoverPasswordDto): Promise<string> {
    try {
      const { email } = recoverPassword;
      const user = await this.usersService.findOneByEmail(email);

      //Se genera un token que expira en 10min para la verificación
      const token = await this.jwtService.signAsync({
        sub: user.id,
        username: user.email,
      });

      //aca iria la implementacion de la creacion y el envio del
      //token y el correo con el link del formulario para cambiar la contraseña
      await this.mailsService.sendMails('data', 'RESET_PASSWORD');

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

  //Para cambiar la contraseña una vez verificado el token de verificación
  async resetPassword(resetPassword: ResetPasswordDto): Promise<string> {
    try {
      const { password } = resetPassword;

      //modificar con nueva implementacion
      //buscar al user con la informacion del token y cambiar contraseña
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
