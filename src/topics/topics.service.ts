import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Topic } from './entities/topic.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicsRepository: Repository<Topic>,
  ) {}

  create(createTopicDto: CreateTopicDto) {
    return this.topicsRepository.save(createTopicDto);
  }

  findAll() {
    return this.topicsRepository.find();
  }

  findOne(id: number) {
    return this.topicsRepository.findOne({ where: { id } });
  }

  update(id: number, updateTopicDto: UpdateTopicDto) {
    const topic = this.topicsRepository.findOne({ where: { id } });
    if (!topic) {
      throw new BadRequestException('Topic not found');
    }

    return this.topicsRepository.save({ ...topic, ...updateTopicDto });
  }

  remove(id: number) {
    return this.topicsRepository.softDelete({ id });
  }
}
