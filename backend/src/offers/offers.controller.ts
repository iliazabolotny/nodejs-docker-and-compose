import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req, BadRequestException, NotFoundException,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { WishesService } from '../wishes/wishes.service';

@Controller('offers')
@UseGuards(JwtGuard)
export class OffersController {
  constructor(
    private offersService: OffersService,
    private wishesService: WishesService,
  ) {}

  @Post()
  async create(@Req() req, @Body() createOfferDto: CreateOfferDto) {
    const usersWishes = await this.wishesService.findWishesByUser(req.user);
    if (usersWishes.find((wish)=> wish.id === createOfferDto.itemId)) {
      throw new BadRequestException('Нельзя вносить деньги на собственные подарки.');
    }
    const wish = await this.wishesService.findOne(createOfferDto.itemId);
    const currentAmount = createOfferDto.amount + wish.raised;
    if (wish.price > currentAmount) {
      await this.wishesService.updateAmount(createOfferDto.itemId, {raised: currentAmount});
      await this.offersService.createOffer(createOfferDto, req.user, wish);
    } else {
      throw new BadRequestException('Сумма собранных средств не может превышать стоимость подарка.');
    }
  }

  @Get()
  async findAll() {
    const offers = await this.offersService.findAll();
    const resultOffers = [];
    for (let i=0; i< offers.length; i++) {
      const {password, ...responseOwner} = offers[i].owner;
      resultOffers.push({
        ...offers[i],
        owner: responseOwner
      });
    }
    return resultOffers;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const numericId = parseInt(id, 10);

    if (isNaN(numericId) || numericId <= 0) {
      throw new BadRequestException('Некорректный id');
    }
    const offer = this.offersService.findOne(numericId);
    if (!offer) {
      throw new NotFoundException();
    }
    const foundOffer = await this.offersService.findOne(numericId);
    const {password, ...responseOwner} = foundOffer.owner;
    return {
      ...foundOffer,
      owner: responseOwner
    }
  }
}
