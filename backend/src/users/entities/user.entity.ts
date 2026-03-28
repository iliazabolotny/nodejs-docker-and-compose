import {
  Column,
  Entity, OneToMany
} from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import {BaseEntity} from '../../common/entities/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ unique: true })
  @Length(2, 30)
  username: string;

  @Column()
  password: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  about: string;

  @OneToMany(() => Wish, (wish) => wish.owner, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  wishes: Wish[];
  @OneToMany(() => Offer, (offer) => offer.owner, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  offers: Offer[];
  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  wishlists: Wishlist[];
}
