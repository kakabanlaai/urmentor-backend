import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSessionRegisterDto } from './dto/create-session-register.dto';
import { UpdateSessionRegisterDto } from './dto/update-session-register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionRegister } from './entities/session-register.entity';
import { User } from 'src/users/entities/user.entity';
import { Program } from 'src/programs/entities/program.entity';
import { Session } from 'src/session/entities/session.entity';
import { SessionRegisterStatus } from './enums/session-register-status';

@Injectable()
export class SessionRegisterService {
  constructor(
    @InjectRepository(SessionRegister)
    private readonly sessionRegisterRepository: Repository<SessionRegister>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
  ) {}

  async create(createSessionRegisterDto: CreateSessionRegisterDto) {
    const session = await this.sessionRepository.findOne({
      where: { id: createSessionRegisterDto.sessionId },
    });

    if (!session) {
      throw new BadRequestException('Session not found');
    }

    const user = await this.userRepository.findOne({
      where: { id: createSessionRegisterDto.menteeId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const program = await this.programRepository.findOne({
      where: { id: createSessionRegisterDto.programId },
    });

    if (!program) {
      throw new BadRequestException('Program not found');
    }

    const sessionRegister = this.sessionRegisterRepository.create({
      session: session,
      mentee: user,
      program: program,
      detail: createSessionRegisterDto.detail,
    });

    return this.sessionRegisterRepository.save(sessionRegister);
  }

  findAll() {
    return `This action returns all sessionRegister`;
  }

  findOne(id: number) {
    return this.sessionRegisterRepository.findOne({
      where: { id },
      relations: {
        session: true,
        mentee: true,
        program: {
          user: true,
        },
      },
    });
  }

  update(id: number, updateSessionRegisterDto: UpdateSessionRegisterDto) {
    return `This action updates a #${id} sessionRegister`;
  }

  remove(id: number) {
    return this.sessionRegisterRepository.softDelete(id);
  }

  async accept(id: number) {
    const sessionRegister = await this.sessionRegisterRepository.findOne({
      where: { id },
      relations: {
        session: {
          sessionRegisters: true,
        },
      },
    });

    if (!sessionRegister) {
      throw new BadRequestException('Session register not found');
    }

    for (const sesRes of sessionRegister.session.sessionRegisters) {
      if (sesRes.id !== sessionRegister.id) {
        await this.sessionRegisterRepository.update(sesRes.id, {
          status: SessionRegisterStatus.Rejected,
        });
      }
    }

    await this.sessionRegisterRepository.update(id, {
      status: SessionRegisterStatus.Approved,
    });

    return sessionRegister;
  }

  done(id: number) {
    return this.sessionRegisterRepository.update(id, {
      status: SessionRegisterStatus.Done,
    });
  }
}
