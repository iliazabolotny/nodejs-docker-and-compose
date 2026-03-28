import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Length } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
export class Wishlist extends BaseEntity {
  @Column()
  name: string;
  @Column({ nullable: true})
  @Length(1500)
  description: string;
  @Column({ nullable: true})
  image: string;
  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
  @OneToMany(() => Wish, (wish) => wish.wishlist, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  items: Wish[];
}
