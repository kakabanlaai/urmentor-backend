import { MentorApplicationStatus } from 'src/mentor-applications/enums/status.enum';
import { Program } from 'src/programs/entities/program.entity';
import { Session } from 'src/session/entities/session.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SessionRegister {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => Program, (program) => program.sessionRegisters)
  program: Program;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.sessionRegisters)
  mentee: User;

  @JoinColumn()
  @ManyToOne(() => Session, (session) => session.sessionRegisters)
  session: Session;

  @Column({
    type: 'enum',
    enum: MentorApplicationStatus,
    default: MentorApplicationStatus.Pending,
  })
  status: MentorApplicationStatus;

  @Column()
  detail: string;

  @DeleteDateColumn()
  deleteAt: Date;
}
