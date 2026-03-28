import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private  wishlistRepository: Repository<Wishlist>,
    private wishesService: WishesService
  ) {}

  createWishlist(createWishlistDto: CreateWishlistDto, user: User): Promise<Wishlist> {
    const wishList = this.wishlistRepository.create({...createWishlistDto, owner: user});
    return this.wishlistRepository.save(wishList);
  }

  async saveWishlist(wishlist: Wishlist, updateWishlistDto: UpdateWishlistDto) {
    wishlist.name = updateWishlistDto.name;
    wishlist.image = updateWishlistDto.image;
    const resultWishes: Wish[] = [];
    wishlist.items = [];
    for (let i = 0; i < updateWishlistDto.itemsId.length; i++) {
      const wish = await this.wishesService.findOne(updateWishlistDto.itemsId[i]);
      resultWishes.push(wish);
    }
    wishlist.items = resultWishes;
    return this.wishlistRepository.save(wishlist);
  }

  findAll() {
    return this.wishlistRepository.find({relations: ['owner', 'items']});
  }

  findOne(id: number) {
    return this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items']
    });
  }

  remove(id: number) {
    return this.wishlistRepository.delete( { id});
  }
}
