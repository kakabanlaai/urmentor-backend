import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../enums/role.enum';
import { ApiKey } from '../api-keys/entities/api-key.entity';
import { Exclude } from 'class-transformer';
import { MentorProfile } from '../../mentor-profiles/entities/mentor-profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.Mentee })
  role: Role;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: 0 })
  coin: number;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isBlocked: boolean;

  @Column({ default: true })
  hasSetPass: boolean;

  @Column({ nullable: true })
  @Exclude()
  googleId: string;

  @JoinColumn()
  @OneToOne(() => MentorProfile, (mentorProfile) => mentorProfile.user)
  mentorProfile: MentorProfile;

  @JoinTable()
  @OneToMany(() => ApiKey, (apiKey) => apiKey.user)
  apiKeys: ApiKey[];

  @DeleteDateColumn()
  @Exclude()
  deleteAt: Date;
}
