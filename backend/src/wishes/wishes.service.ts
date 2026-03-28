import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from './entities/wish.entity';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>
  ) {}

  async create(createWishDto: CreateWishDto, user?: any): Promise<Wish> {
    const createdWish = this.wishRepository.create({ ...createWishDto, owner: user});
    return this.wishRepository.save(createdWish);
  }

  findAll() {
    return this.wishRepository.find();
  }

  async findWishesByUser(user: User) {
    return await this.wishRepository.find({where: { owner: { id: user.id}},  relations: ['owner', 'offers'],});
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers']
    });

    if (!wish) {
      throw new NotFoundException(`Пользователь не найден`);
    }

    return wish;
  }

  update(id: number, updateWishDto: UpdateWishDto) {
    return this.wishRepository.update({ id }, updateWishDto);
  }

  updateAmount(id: number, targetAmount: {raised: number}) {
    return this.wishRepository.update({id}, targetAmount);
  }

  remove(id: number) {
    return this.wishRepository.delete({ id });
  }

  async getRecentWishes(): Promise<Wish[]> {
    return this.wishRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['owner', 'offers'],
      take: 40,
    });
  }

  async getPopularWishes(): Promise<Wish[]> {
    return this.wishRepository.find({
      order: { copied: 'DESC' },
      relations: ['owner', 'offers'],
      take: 20,
    });
  }
}
