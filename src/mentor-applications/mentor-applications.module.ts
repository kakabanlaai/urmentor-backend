import { Module } from '@nestjs/common';
import { MentorApplicationsService } from './mentor-applications.service';
import { MentorApplicationsController } from './mentor-applications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentorApplication } from './entities/mentor-application.entity';
import { User } from 'src/users/entities/user.entity';
import { MailsService } from 'src/mails/mails.service';

@Module({
  imports: [TypeOrmModule.forFeature([MentorApplication, User])],
  controllers: [MentorApplicationsController],
  providers: [MentorApplicationsService, MailsService],
})
export class MentorApplicationsModule {}
