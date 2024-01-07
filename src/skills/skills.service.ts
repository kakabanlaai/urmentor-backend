import { Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillsRepository: Repository<Skill>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createSkillDto: CreateSkillDto, userId: number) {
    const existedSkill = await this.skillsRepository.findOne({
      where: { name: createSkillDto.name.trim() },
      relations: {
        users: true,
      },
    });

    if (existedSkill) {
      existedSkill.users = [
        ...existedSkill.users,
        await this.userRepository.findOne({ where: { id: userId } }),
      ];
      await this.skillsRepository.save(existedSkill);
      return existedSkill;
    }

    const skill = this.skillsRepository.create({
      ...createSkillDto,
      users: [await this.userRepository.findOne({ where: { id: userId } })],
    });

    await this.skillsRepository.save(skill);
    return skill;
  }

  findAll() {
    return this.skillsRepository.find();
  }

  findOne(id: number) {
    return this.skillsRepository.findOne({
      where: {
        id,
      },
      relations: {
        users: true,
      },
    });
  }

  update(id: number, updateSkillDto: UpdateSkillDto) {
    return;
  }

  remove(id: number) {
    return this.skillsRepository.softDelete(id);
  }
}
