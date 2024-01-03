import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Education {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  school: string;

  @Column()
  major: string;

  @Column()
  degree: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ default: true })
  isCurrent: boolean;

  @ManyToOne(() => User, (user) => user.educations)
  user: User;

  @DeleteDateColumn()
  deletedAt: Date;
}
