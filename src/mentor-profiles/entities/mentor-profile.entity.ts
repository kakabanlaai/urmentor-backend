import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class MentorProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  introduction: string;

  @Column()
  linkedin: string;

  @Column()
  cv: string;

  @OneToOne(() => User, (user) => user.mentorProfile)
  user: User;
}
