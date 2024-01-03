import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { Achievement } from './entities/achievement.entity';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
  ) {}

  async create(createAchievementDto: CreateAchievementDto) {
    const achievement = this.achievementRepository.create(createAchievementDto);
    await this.achievementRepository.save(achievement);
    return achievement;
  }

  findAll() {
    return this.achievementRepository.find();
  }

  findOne(id: number) {
    return this.achievementRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateAchievementDto: UpdateAchievementDto) {
    await this.achievementRepository.update(id, updateAchievementDto);
    return this.achievementRepository.findOne({
      where: {
        id,
      },
    });
  }

  remove(id: number) {
    return this.achievementRepository.delete(id);
  }
}
