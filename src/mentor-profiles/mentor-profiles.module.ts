import { Module } from '@nestjs/common';
import { MentorProfilesService } from './mentor-profiles.service';
import { MentorProfilesController } from './mentor-profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentorProfile } from './entities/mentor-profile.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MentorProfile, User])],
  controllers: [MentorProfilesController],
  providers: [MentorProfilesService],
})
export class MentorProfilesModule {}
