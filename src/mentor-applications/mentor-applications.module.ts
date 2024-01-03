import { Module } from '@nestjs/common';
import { MentorApplicationsService } from './mentor-applications.service';
import { MentorApplicationsController } from './mentor-applications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentorApplication } from './entities/mentor-application.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MentorApplication, User])],
  controllers: [MentorApplicationsController],
  providers: [MentorApplicationsService],
})
export class MentorApplicationsModule {}
