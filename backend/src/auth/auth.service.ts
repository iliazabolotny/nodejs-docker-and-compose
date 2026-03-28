import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload, {secret: 'kupipodariday'}) };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return null;
    }
    return user;
  }
}
