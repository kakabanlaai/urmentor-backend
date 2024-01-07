import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../enums/role.enum';

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
}
