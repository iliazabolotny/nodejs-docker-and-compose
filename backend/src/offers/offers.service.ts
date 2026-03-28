import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}

  createOffer(createOfferDto: CreateOfferDto, author?: User, wish?: Wish): Promise<Offer> {
    const offer = this.offerRepository.create({ owner: author, item: wish, hidden: createOfferDto.hidden, amount: createOfferDto.amount});
    return this.offerRepository.save(offer);
  }

  findAll() {
    return this.offerRepository.find({relations: ['owner', 'item'] });
  }

  findOne(id: number) {
    return this.offerRepository.findOne({ where: { id } , relations: ['owner', 'item'] });
  }

  remove(id: number) {
    return this.offerRepository.delete({ id });
  }
}
