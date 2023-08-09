import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {

    constructor(
        private JwtService: JwtService
    ){}

    async generatePassword(password: string) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    async generateToken(userId: string, userEmail: string) {
        return await this.JwtService.signAsync({sub:userId, username: userEmail});
    }
}
