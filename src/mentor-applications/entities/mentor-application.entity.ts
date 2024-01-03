import { Exclude } from 'class-transformer';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MentorApplicationStatus } from '../enums/status.enum';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class MentorApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  introduction: string;

  @Column({ nullable: true })
  cv: string;

  @Column({
    type: 'enum',
    enum: MentorApplicationStatus,
    default: MentorApplicationStatus.Pending,
  })
  status: MentorApplicationStatus;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;

  @JoinColumn()
  @OneToOne(() => User, (user) => user.mentorApplication)
  user: User;
}
