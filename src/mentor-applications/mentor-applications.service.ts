import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMentorApplicationDto } from './dto/create-mentor-application.dto';
import { UpdateMentorApplicationDto } from './dto/update-mentor-application.dto';
import { MentorApplication } from './entities/mentor-application.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MentorApplicationStatus } from './enums/status.enum';
import { Role } from 'src/users/enums/role.enum';

@Injectable()
export class MentorApplicationsService {
  constructor(
    @InjectRepository(MentorApplication)
    private readonly mentorApplicationRepository: Repository<MentorApplication>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createMentorApplicationDto: CreateMentorApplicationDto,
    userId: number,
  ) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        mentorApplication: true,
      },
    });

    if (user.role !== Role.Mentee) {
      throw new BadRequestException('Only mentees can apply for a mentor');
    }

    if (
      user.mentorApplication &&
      user.mentorApplication.status === MentorApplicationStatus.Pending
    ) {
      throw new BadRequestException('User already has a mentor application');
    }

    const mentorApplication = new MentorApplication();
    mentorApplication.introduction = createMentorApplicationDto.introduction;
    mentorApplication.cv = createMentorApplicationDto.cv || null;
    mentorApplication.user = user;

    await this.userRepository.save(user);
    await this.mentorApplicationRepository.save(mentorApplication);

    return mentorApplication;
  }

  async findAll() {
    return await this.mentorApplicationRepository.find({
      where: {
        status: MentorApplicationStatus.Pending,
      },
      relations: {
        user: true,
      },
    });
  }

  async findOne(id: number) {
    const mentorApplication = await this.mentorApplicationRepository.findOne({
      where: { id: id },
      relations: {
        user: true,
      },
    });
    if (!mentorApplication) {
      throw new NotFoundException(`Mentor application with ID ${id} not found`);
    }
    return mentorApplication;
  }

  update(id: number, updateMentorApplicationDto: UpdateMentorApplicationDto) {
    return `This action updates a #${id} mentorApplication`;
  }

  remove(id: number) {
    return `This action removes a #${id} mentorApplication`;
  }
}
