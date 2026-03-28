import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Length, IsUrl, IsNumber, IsInt } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
export class Wish extends BaseEntity {
  @Column()
  @Length(1, 250)
  name: string;
  @Column()
  @IsUrl()
  link: string;
  @Column()
  @IsUrl()
  image: string;
  @Column()
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;
  @Column({ default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  raised: number;
  @Column()
  @Length(1, 1024)
  description: string;
  @Column({ default: 0 })
  @IsInt()
  copied: number;
  @ManyToOne(() => User, (owner) => owner.wishes)
  owner: User;
  @OneToMany(() => Offer, (offer) => offer.item, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  offers: Offer[];
  @ManyToOne(() => Wishlist, (wishlist) => wishlist.items, {
    onDelete: 'CASCADE', // автоматическое удаление связанных wish
    onUpdate: 'CASCADE'
  })
  wishlist: Wishlist;
}