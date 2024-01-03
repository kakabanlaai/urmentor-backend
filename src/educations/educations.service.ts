import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { Education } from './entities/education.entity';

@Injectable()
export class EducationsService {
  constructor(
    @InjectRepository(Education)
    private educationRepository: Repository<Education>,
  ) {}

  async create(createEducationDto: CreateEducationDto): Promise<Education> {
    const newEducation = this.educationRepository.create(createEducationDto);
    return this.educationRepository.save(newEducation);
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
  ): Promise<Education> {
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
