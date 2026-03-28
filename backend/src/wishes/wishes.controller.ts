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
  HttpStatus, BadRequestException,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  async create(@Req() req, @Body() createWishDto: CreateWishDto) {
    await this.wishesService.create(createWishDto, req.user);
  }

  @Post(':id/copy')
  @UseGuards(JwtGuard)
  async copyWish(@Param('id') id: string, @Req() req) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId) || numericId <= 0) {
        throw new BadRequestException('Некорректный id');
    }

    const targetWish = await this.wishesService.findOne(numericId);
    await this.wishesService.update(+id, {...targetWish, copied: targetWish.copied + 1});
    const result = {
      name: targetWish.name,
      link: targetWish.link,
      image: targetWish.image,
      price: targetWish.price,
      description: targetWish.description
    }
    await this.wishesService.create(result, req.user);
    }

  @Get('top')
  async findTop() {
      const topWishes = await this.wishesService.getPopularWishes();
      const resultWishes = [];
      for (let i=0; i < topWishes.length; i++) {
        const {email, password, ...responseOwner} = topWishes[i].owner;
        resultWishes.push({
          ...topWishes[i],
          owner: responseOwner
        });
      }
      return resultWishes;
  }

  @Get('last')
  async findLast() {
    const lastWishes =await this.wishesService.getRecentWishes();
    const resultWishes = [];
    for (let i=0; i< lastWishes.length; i++) {
      const {email, password, ...responseOwner} = lastWishes[i].owner;
      resultWishes.push({
        ...lastWishes[i],
        owner: responseOwner
      });
    }
    return resultWishes;
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getWishById(@Param('id') id: string) {
    const numericId = parseInt(id, 10);

    if (isNaN(numericId) || numericId <= 0) {
      throw new BadRequestException('Некорректный id');
    }
    const foundWish = await this.wishesService.findOne(numericId);
    const {email, password, ...responseOwner} = foundWish.owner;
    return {
      ...foundWish,
      owner: responseOwner
    }
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const usersWishes = await this.wishesService.findWishesByUser(req.user);
    const numericId = parseInt(id, 10);

    if (isNaN(numericId) || numericId <= 0) {
      throw new BadRequestException('Некорректный id');
    }
    if (usersWishes.find((wish) => wish.id === numericId)) {
     await this.wishesService.update(+id, updateWishDto);
    }
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async remove(@Req() req, @Param('id') id: string) {
    const usersWishes = await this.wishesService.findWishesByUser(req.user);
    const numericId = parseInt(id, 10);

    if (isNaN(numericId) || numericId <= 0) {
      throw new BadRequestException('Некорректный id');
    }
    const foundWish = await this.wishesService.findOne(numericId);
    if (usersWishes.find((wish) => wish.id === numericId)) {
      await this.wishesService.remove(+id);
      const {email, password, ...responseOwner} = foundWish.owner;
      return {
        ...foundWish,
        owner: responseOwner
      }
    }
  }
}
