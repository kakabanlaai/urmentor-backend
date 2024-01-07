import { Topic } from 'src/topics/entities/topic.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Program {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: 0 })
  price: number;

  @ManyToOne(() => Topic, (topic) => topic.programs)
  topic: Topic;

  @ManyToOne(() => User, (user) => user.programs)
  user: User;
}
