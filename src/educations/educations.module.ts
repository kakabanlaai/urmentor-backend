import { Module } from '@nestjs/common';
import { EducationsService } from './educations.service';
import { EducationsController } from './educations.controller';
import { Education } from './entities/education.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Education])],
  controllers: [EducationsController],
  providers: [EducationsService],
})
export class EducationsModule {}
