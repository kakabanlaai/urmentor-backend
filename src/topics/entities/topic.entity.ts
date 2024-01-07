import { Program } from 'src/programs/entities/program.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => Program, (program) => program.topic)
  programs: Program[];

  @DeleteDateColumn()
  deletedAt: Date;
}
