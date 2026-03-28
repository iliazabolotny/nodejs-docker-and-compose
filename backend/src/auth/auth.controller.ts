import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from '../guards/local.guard';
import { User } from '../users/entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  @HttpCode(HttpStatus.CREATED)
  signin(@Req() req: { user: User }) {
    /* Генерируем для пользователя JWT-токен */
    const user = req?.user;
    return this.authService.auth(user);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() createUserDto: RegisterUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    return this.authService.auth(user);
  }
}
