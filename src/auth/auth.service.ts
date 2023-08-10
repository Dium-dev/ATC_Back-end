import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private JwtService: JwtService) {}

  async generatePassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async generateToken(userId: string, userEmail: string): Promise<string> {
    const token = await this.JwtService.signAsync({
      sub: userId,
      username: userEmail,
    });
    return token;
  }

  async comparePassword(receivePassword: string, savedPassword: string) {
    const checkPassword = await bcrypt.compare(receivePassword, savedPassword);
    return checkPassword;
  }
}
