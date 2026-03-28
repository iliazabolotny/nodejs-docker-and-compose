import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, UseGuards, Req, NotFoundException, HttpCode, HttpStatus, BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../guards/jwt.guard';
import bcrypt from 'bcrypt';
import { FindUserDto } from './dto/find-user.dto';
import { WishesService } from '../wishes/wishes.service';
import { plainToInstance } from 'class-transformer';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private usersService: UsersService, private wishesService: WishesService) {}

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const numericId = parseInt(id, 10);

    if (isNaN(numericId) || numericId <= 0) {
      throw new BadRequestException('Некорректный id');
    }
    const user = await this.usersService.findOne(numericId);
    if (!user) {
      throw new NotFoundException();
    }
    return await this.usersService.remove(numericId);
  }

  @Get('me')
  async getMe(@Req() req) {
    const currentUser = await this.usersService.findOne(req.user.id);
    return plainToInstance(UserProfileResponseDto, currentUser,  { excludeExtraneousValues: true });
  }

  @Patch('me')
  async patchMe(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const user = req.user;
    const hash = await bcrypt.hash(updateUserDto?.password, 10)
    const result = {
        ...updateUserDto,
        password: hash,
    }
    try {
      await this.usersService.update(+user.id, result) as unknown;
      const updatedUser = {
        id: req.user.id,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updateAt,
        about: updateUserDto.about ?? req.user.about,
        avatar: updateUserDto.avatar ?? req.user.avatar,
        email: updateUserDto.email ?? req.user.email,
        username: updateUserDto.username ?? req.user.username,
      };
      return plainToInstance(UserProfileResponseDto, updatedUser, { excludeExtraneousValues: true });
    } catch (error) {
      throw new error;
    }
  }

  @Get('me/wishes')
  async getProfileWishes(@Req() req) {
    const wishes = await this.wishesService.findWishesByUser(req.user);
    const resultWishes = [];
    for (let i=0; i< wishes.length; i++) {
      const {email, password, ...responseOwner} = wishes[i].owner;
      resultWishes.push({
        ...wishes[i],
        owner: responseOwner
      });
    }
    return resultWishes;
  }

  @Get(':username')
  async getUser(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      return NotFoundException;
    }
    return plainToInstance(UserPublicProfileResponseDto, user, { excludeExtraneousValues: true });
  }

  @Get(':username/wishes')
  async getWishesByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      return NotFoundException;
    }
    const wishes = await this.wishesService.findWishesByUser(user);
    const resultWishes = [];
    for (let i=0; i< wishes.length; i++) {
      const {owner, ...responseOwner} = wishes[i];
      resultWishes.push({
        ...responseOwner
      });
    }
    return resultWishes;
  }

  @Post('find')
  @HttpCode(HttpStatus.CREATED)
  async findUser(@Body() findUserDto: FindUserDto) {
    const searchingUser = findUserDto.query;
    if (!searchingUser) {
      throw new BadRequestException('Необходим Query параметр');
    }

    const preparedQuery = searchingUser.trim();
    const users = await this.usersService.searchUser(preparedQuery);
    return plainToInstance(UserProfileResponseDto, users, { excludeExtraneousValues: true });
  }
}
