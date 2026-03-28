import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus, BadRequestException, NotFoundException,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { WishesService } from '../wishes/wishes.service';
import { Wish } from '../wishes/entities/wish.entity';

@Controller('wishlistlists')
@UseGuards(JwtGuard)
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService, private wishesService: WishesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createWishlistDto: CreateWishlistDto, @Req()  req) {
    const resultWishes: Wish[] = [];
    for (let i = 0; i < createWishlistDto.itemsId.length; i++) {
      const wish = await this.wishesService.findOne(createWishlistDto.itemsId[i]);
      resultWishes.push(wish);
    }
    const wishlist = await this.wishlistsService.createWishlist(createWishlistDto, req.user);
    const {email, password, ...responseOwner} = wishlist.owner;
    return {
      ...wishlist,
      owner: responseOwner
    }
  }

  @Get()
  async findAll() {
    const wishes = await this.wishlistsService.findAll();
    const resultWishes = [];
    for (let i=0; i < wishes.length; i++) {
      const {email, password, ...responseOwner} = wishes[i].owner;
      resultWishes.push({
        ...wishes[i],
        owner: responseOwner
      });
    }
    return resultWishes;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const numericId = parseInt(id, 10);

    if (isNaN(numericId) || numericId <= 0) {
      throw new BadRequestException('Некорректный id');
    }
    const wishlist = await this.wishlistsService.findOne(numericId);
    const {email, password, ...responseOwner} = wishlist.owner;
    return {
      ...wishlist,
      owner: responseOwner
    }
  }

  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    const numericId = parseInt(id, 10);

    if (isNaN(numericId) || numericId <= 0) {
      throw new BadRequestException('Некорректный id');
    }
    const wishlist = await this.wishlistsService.findOne(numericId);
    if (!wishlist) {
      throw new NotFoundException();
    }
    const updatedWishlist = await this.wishlistsService.saveWishlist(wishlist, updateWishlistDto);
    const {email, password, ...responseOwner} = updatedWishlist.owner;
    return {
      ...updatedWishlist,
      owner: responseOwner
    }
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    const numericId = parseInt(id, 10);

    if (isNaN(numericId) || numericId <= 0) {
      throw new BadRequestException('Некорректный id');
    }
    const wishlist = await this.wishlistsService.findOne(numericId);
    if (!wishlist) {
      throw new NotFoundException();
    }
    await this.wishlistsService.remove(numericId);
    const {email, password, ...responseOwner} = wishlist.owner;
    return {
      ...wishlist,
      owner: responseOwner
    }
  }
}
