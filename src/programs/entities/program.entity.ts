import { SessionRegister } from 'src/session-register/entities/session-register.entity';
import { Topic } from 'src/topics/entities/topic.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @OneToMany(
    () => SessionRegister,
    (sessionRegister) => sessionRegister.program,
  )
  sessionRegisters: SessionRegister[];

  @DeleteDateColumn()
  deleteAt: Date;
}
