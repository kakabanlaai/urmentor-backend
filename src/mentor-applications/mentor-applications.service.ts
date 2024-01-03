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
import { MailsService } from 'src/mails/mails.service';

@Injectable()
export class MentorApplicationsService {
  constructor(
    @InjectRepository(MentorApplication)
    private readonly mentorApplicationRepository: Repository<MentorApplication>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly mailsService: MailsService,
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

    // if (user.role !== Role.Mentee) {
    //   throw new BadRequestException('Only mentees can apply for a mentor');
    // }

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

  async update(
    id: number,
    updateMentorApplicationDto: UpdateMentorApplicationDto,
  ) {
    const mentorApplication = await this.mentorApplicationRepository.findOne({
      where: { id: id },
      relations: {
        user: true,
      },
    });

    if (!mentorApplication) {
      throw new NotFoundException(`Mentor application with ID ${id} not found`);
    }

    // Update only the fields provided in the DTO
    for (const [key, value] of Object.entries(updateMentorApplicationDto)) {
      if (value !== undefined) {
        mentorApplication[key] = value;
      }
    }

    if (mentorApplication.status === MentorApplicationStatus.Accepted) {
      mentorApplication.user.role = Role.Mentor;
      await this.userRepository.save(mentorApplication.user);
      await this.mailsService.acceptMentorApplication({
        to: mentorApplication.user.email,
      });
    }

    if (mentorApplication.status === MentorApplicationStatus.Rejected) {
      await this.mailsService.rejectMentorApplication({
        to: mentorApplication.user.email,
      });
    }

    await this.mentorApplicationRepository.save(mentorApplication);

    return mentorApplication;
  }

  remove(id: number) {
    return `This action removes a #${id} mentorApplication`;
  }
}
