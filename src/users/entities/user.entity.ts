import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../enums/role.enum';
import { ApiKey } from '../api-keys/entities/api-key.entity';
import { Exclude } from 'class-transformer';
import { Experience } from '../../experiences/entities/experience.entity';
import { Achievement } from '../../achievements/entities/achievement.entity';
import { Education } from '../../educations/entities/education.entity';
import { MentorApplication } from 'src/mentor-applications/entities/mentor-application.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import { Program } from 'src/programs/entities/program.entity';
import { Rating } from 'src/ratings/entities/rating.entity';
import { Session } from 'src/session/entities/session.entity';
import { SessionRegister } from 'src/session-register/entities/session-register.entity';

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
  @Exclude()
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

  @Column({ nullable: true })
  introduction: string;

  @OneToMany(() => Experience, (experience) => experience.user)
  experiences: Experience[];

  @OneToMany(() => Achievement, (achievement) => achievement.user)
  achievements: Achievement[];

  @OneToMany(() => Education, (education) => education.user)
  educations: Education[];

  @OneToMany(() => SessionRegister, (sessionRegister) => sessionRegister.mentee)
  sessionRegisters: SessionRegister[];

  @ManyToMany(() => Skill, (skills) => skills.users)
  @JoinTable()
  skills: Skill[];

  @OneToMany(() => Rating, (rating) => rating.fromUser)
  sendedRatings: Rating[];

  @OneToMany(() => Rating, (rating) => rating.toUser)
  ratings: Rating[];

  @OneToMany(() => Program, (program) => program.user)
  programs: Program[];

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToOne(
    () => MentorApplication,
    (mentorApplication) => mentorApplication.user,
  )
  mentorApplication: MentorApplication;

  @JoinTable()
  @OneToMany(() => ApiKey, (apiKey) => apiKey.user)
  apiKeys: ApiKey[];

  @DeleteDateColumn()
  @Exclude()
  deleteAt: Date;
}
