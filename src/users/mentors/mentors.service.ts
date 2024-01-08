import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Not, Repository } from 'typeorm';
import { Role } from '../enums/role.enum';
import { BadRequestException } from '@nestjs/common';

export class MentorsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getMentors(): Promise<User[]> {
    return await this.userRepository.find({
      where: {
        role: Role.Mentor,
      },
      relations: {
        achievements: true,
        experiences: true,
        educations: true,
        skills: true,
        programs: true,
        ratings: true,
      },
    });
  }

  async getMentorById(id: number): Promise<User> {
    const mentor = await this.userRepository.findOne({
      where: {
        id,
        role: Not(Role.Admin),
      },
      relations: {
        achievements: true,
        experiences: true,
        educations: true,
        skills: true,
        programs: true,
        ratings: {
          fromUser: true,
        },
      },
    });
    if (!mentor) {
      throw new BadRequestException('Mentor not found');
    }

    return mentor;
  }
}
