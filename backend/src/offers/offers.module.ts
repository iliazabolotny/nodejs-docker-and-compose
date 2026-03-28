import { forwardRef, Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offer.entity';
import { WishesModule } from '../wishes/wishes.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Offer]), forwardRef(() => WishesModule), forwardRef(()=> AuthModule)],
  controllers: [OffersController],
  providers: [OffersService],
  exports: [OffersService],
})
export class OffersModule {}
