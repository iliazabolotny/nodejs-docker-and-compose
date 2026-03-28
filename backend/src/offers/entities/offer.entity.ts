import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { IsNumber } from 'class-validator';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
export class Offer extends BaseEntity {
  @Column()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;
  @Column({ default: false })
  hidden: boolean;
  @ManyToOne(() => User, (user) => user.offers)
  owner: User;
  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;
}