import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionsRepository: Repository<Session>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createSessionDto: CreateSessionDto) {
    const user = await this.usersRepository.findOne({
      where: { id: createSessionDto.userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const session = this.sessionsRepository.create({
      start: createSessionDto.start,
      end: createSessionDto.end,
      user: user,
    });

    return this.sessionsRepository.save(session);
  }

  findAll(userId: number) {
    return this.sessionsRepository.find({
      where: { user: { id: userId } },
    });
  }

  findOne(id: number) {
    return this.sessionsRepository.findOne({
      where: { id },
      relations: {
        sessionRegisters: {
          mentee: true,
          program: true,
        },
      },
    });
  }

  update(id: number, updateSessionDto: UpdateSessionDto) {
    return `This action updates a #${id} session`;
  }

  remove(id: number) {
    return this.sessionsRepository.softRemove({ id });
  }
}
