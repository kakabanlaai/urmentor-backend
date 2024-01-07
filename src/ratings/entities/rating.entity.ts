import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @Column()
  comment: string;

  @ManyToOne(() => User, (user) => user.sendedRatings)
  fromUser: User;

  @ManyToOne(() => User, (user) => user.ratings)
  toUser: User;
}
