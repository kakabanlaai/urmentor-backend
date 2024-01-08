import { SessionRegister } from 'src/session-register/entities/session-register.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  @OneToMany(
    () => SessionRegister,
    (sessionRegister) => sessionRegister.session,
  )
  sessionRegisters: SessionRegister[];

  @DeleteDateColumn()
  deleteAt: Date;
}
