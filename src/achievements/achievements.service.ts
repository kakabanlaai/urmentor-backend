import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { Achievement } from './entities/achievement.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createAchievementDto: CreateAchievementDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }
    const achievement = this.achievementRepository.create(createAchievementDto);

    achievement.user = user;
    await this.achievementRepository.save(achievement);
    delete achievement.user; // remove user from achievement
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

  async update(
    id: number,
    updateAchievementDto: UpdateAchievementDto,
    userId: number,
  ) {
    // Check if the achievement exists
    const achievement = await this.achievementRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!achievement) {
      throw new BadRequestException(`Achievement with ID ${id} not found.`);
    }

    // Check if the user is the owner of the achievement
    if (achievement.user.id !== userId) {
      throw new BadRequestException(
        `User with ID ${userId} is not authorized to update this achievement.`,
      );
    }

    await this.achievementRepository.update(id, updateAchievementDto);
    return await this.achievementRepository.findOne({ where: { id } });
  }

  remove(id: number) {
    return this.achievementRepository.softDelete(id);
  }
}
