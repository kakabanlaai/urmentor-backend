import { Topic } from './../topics/entities/topic.entity';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Program } from './entities/program.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Program)
    private readonly programsRepository: Repository<Program>,
    @InjectRepository(Topic)
    private readonly topicsRepository: Repository<Topic>,
  ) {}

  create(createProgramDto: CreateProgramDto, userId: number) {
    const program = this.programsRepository.create({
      title: createProgramDto.title,
      description: createProgramDto.description,
      price: createProgramDto.price,
      user: { id: userId },
      topic: { id: createProgramDto.topicId },
    });
    return this.programsRepository.save(program);
  }

  findAll(findOptions?: FindManyOptions<Program>) {
    return this.programsRepository.find(findOptions);
  }

  findOne(id: number, findOptions?: FindOneOptions<Program>) {
    return this.programsRepository.findOne(
      Object.assign(
        {
          where: {
            id,
          },
        },
        findOptions,
      ),
    );
  }

  async update(id: number, updateProgramDto: UpdateProgramDto, userId: number) {
    const program = await this.programsRepository.findOne({
      where: { id },
      relations: {
        user: true,
        topic: true,
      },
    });

    if (!program) {
      throw new BadRequestException('Program not found');
    }

    if (program.user.id !== userId) {
      throw new ForbiddenException('Cannot update program');
    }

    if (updateProgramDto.topicId !== undefined) {
      const topic = await this.topicsRepository.findOne({
        where: { id: updateProgramDto.topicId },
      });
      if (!topic) {
        throw new BadRequestException('Topic not found');
      }
      program.topic = topic;
    }

    return this.programsRepository.save({ ...program, ...updateProgramDto });
  }

  remove(id: number) {
    return this.programsRepository.softRemove({ id });
  }
}
