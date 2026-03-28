import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hash = await bcrypt.hash(createUserDto.password, 10);
      const result = {
        ...createUserDto,
        password: hash
      };
      const user = this.userRepository.create(result);
      return this.userRepository.save(user);
    } catch (error: unknown) {
      const errorCode = error as { code: string };
      if (errorCode.code === '23505') {
        throw new ConflictException(
          'Пользователь с таким email или username уже существует',
        );
      }
      throw error;
    }
  }

  async findOne(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update({ id }, updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepository.delete({ id });
  }

  async findByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async searchByUsername(username: string) {
    return await this.userRepository.find({
      where: { username: ILike(`%${username}%`) },
    });
  }

  async searchByEmail(email: string) {
    return await this.userRepository.find({
      where: { email: ILike(`%${email}%`) },
    });
  }

  async searchUser(query: string) {
    return await this.userRepository.find({
      where: [
        { username: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
      ],
    });
  }
}
