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
import { SessionRegisterStatus } from '../enums/session-register-status';

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
    enum: SessionRegisterStatus,
    default: SessionRegisterStatus.Pending,
  })
  status: SessionRegisterStatus;

  @Column()
  detail: string;

  @Column({ default: false })
  isDone: boolean;

  @DeleteDateColumn()
  deleteAt: Date;
}
