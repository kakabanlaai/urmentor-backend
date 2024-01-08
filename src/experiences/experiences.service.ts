import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from './entities/experience.entity';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperiencesService {
  constructor(
    @InjectRepository(Experience)
    private experiencesRepository: Repository<Experience>,
  ) {}

  async create(createExperienceDto: CreateExperienceDto) {
    const newExperience =
      this.experiencesRepository.create(createExperienceDto);
    await this.experiencesRepository.save(newExperience);
    return newExperience;
  }

  findAll() {
    return this.experiencesRepository.find();
  }

  findOne(id: number) {
    return this.experiencesRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateExperienceDto: UpdateExperienceDto) {
    await this.experiencesRepository.update(id, updateExperienceDto);
    return this.experiencesRepository.findOne({
      where: {
        id,
      },
    });
  }

  remove(id: number) {
    return this.experiencesRepository.softRemove({ id });
  }
}
