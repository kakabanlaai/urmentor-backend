import { Module } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { ProgramsController } from './programs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from './entities/program.entity';
import { Topic } from 'src/topics/entities/topic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Program, Topic])],
  controllers: [ProgramsController],
  providers: [ProgramsService],
})
export class ProgramsModule {}
