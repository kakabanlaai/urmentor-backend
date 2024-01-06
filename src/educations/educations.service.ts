import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { Education } from './entities/education.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class EducationsService {
  constructor(
    @InjectRepository(Education)
    private educationRepository: Repository<Education>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createEducationDto: CreateEducationDto,
    userId: number,
  ): Promise<Education> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    const newEducation = this.educationRepository.create(createEducationDto);
    newEducation.user = user;

    await this.educationRepository.save(newEducation);
    delete newEducation.user;
    return newEducation;
  }

  findAll(): Promise<Education[]> {
    return this.educationRepository.find();
  }

  findOne(id: number): Promise<Education> {
    return this.educationRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    updateEducationDto: UpdateEducationDto,
    userId: number,
  ): Promise<Education> {
    const education = await this.educationRepository.findOne({
      where: { id: id },
      relations: { user: true },
    });
    if (!education) {
      throw new BadRequestException(`Education with ID ${id} not found.`);
    }

    if (education.user.id !== userId) {
      throw new BadRequestException(
        `User with ID ${userId} is not authorized to update this education.`,
      );
    }

    await this.educationRepository.update(id, updateEducationDto);
    return this.educationRepository.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: number): Promise<void> {
    return this.educationRepository.delete(id).then(() => null);
  }
}
