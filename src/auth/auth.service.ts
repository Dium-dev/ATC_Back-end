import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Inject,
  forwardRef,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserChangePasswordDto } from './dto/user-change-password.dto';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';
import { IResponse } from '../utils/interfaces/response.interface';
import { MailService } from '../mail/mail.service';
import { Cases } from '../mail/dto/sendMail.dto';
import { IGetUser } from './interefaces/getUser.interface';
import { Rol } from 'src/users/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly mailsService: MailService,
  ) { }

  async generatePassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async generateToken(userId: string, userEmail: string, rol: Rol): Promise<string> {
    const token = await this.jwtService.signAsync({
      userId: userId,
      userEmail: userEmail,
      rol: rol
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

  async recoverPassword(
    recoverPassword: RecoverPasswordDto,
  ): Promise<IResponse> {
    try {
      const { email } = recoverPassword;
      const user = await this.usersService.findOneByEmail(email);
      const token = jwt.sign({ sub: user.email }, JWT_SECRET, {
        expiresIn: '30m',
      });

      //Setting up for email sending
      const context = {
        name: user.firstName,
        link: `https://link-del-front-pasado-por-env?token=${token}`,
      };
      const mailData = {
        EmailAddress: user.email,
        subject: Cases.RESET_PASSWORD,
        context: context,
      };
      const mail = await this.mailsService.sendMails(mailData);

      return mail;
    } catch (error) {
      switch (error.constructor) {
        case BadRequestException:
          throw new BadRequestException(error.message);
        case UnauthorizedException:
          throw new UnauthorizedException(error.message);
        default:
          throw new InternalServerErrorException('Error interno del servidor');
      }
    }
  }

  async resetPassword(
    resetPassword: ResetPasswordDto,
    token: string,
  ): Promise<IResponse> {
    try {
      if (token) {
        const payload = jwt.verify(token, JWT_SECRET);
        if (payload) {
          const { sub } = payload;
          const userEmail = sub.toString();
          const { password } = resetPassword;

          const userChangePassword = await this.usersService.findOneByEmail(
            userEmail,
          );
          userChangePassword.password = await this.generatePassword(password);
          userChangePassword.save();
          return {
            statusCode: 200,
            message: 'El cambio de la contraseña fue exitoso.',
          };
        } else {
          throw new UnauthorizedException(
            'No esta autorizado para esta acción',
          );
        }
      } else {
        throw new UnauthorizedException(
          'Faltan datos para completar esta acción',
        );
      }
    } catch (error) {
      switch (error.constructor) {
        case BadRequestException:
          throw new BadRequestException(error.message);
        case UnauthorizedException:
          throw new UnauthorizedException(error.message);
        default:
          throw new InternalServerErrorException('Error interno del servidor');
      }
    }
  }

  async changePassword(
    changePassword: ChangePasswordDto,
    user: IGetUser,
  ): Promise<IResponse> {
    try {
      const { oldPassword, newPassword } = changePassword;
      const { userEmail } = user;

      const userFind = await this.usersService.findOneByEmail(userEmail);

      const validatePassword = await this.comparePassword(
        oldPassword,
        userFind.password,
      );

      if (validatePassword) {
        userFind.password = await this.generatePassword(newPassword);
        userFind.save();
        return {
          statusCode: 204,
          message: 'El cambio de la contraseña fue exitoso.',
        };
      } else {
        throw new BadRequestException(
          'La contraseña actual recibida no corresponde con la guardada en la aplicación',
        );
      }
    } catch (error) {
      switch (error.constructor) {
        case BadRequestException:
          throw new BadRequestException(error.message);
        case UnauthorizedException:
          throw new UnauthorizedException(error.message);
        default:
          throw new InternalServerErrorException('Error interno del servidor');
      }
    }
  }
}
