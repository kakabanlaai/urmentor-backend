import { PartialType } from '@nestjs/swagger';
import { CreateMentorApplicationDto } from './create-mentor-application.dto';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { MentorApplicationStatus } from '../enums/status.enum';

export class UpdateMentorApplicationDto extends PartialType(
  CreateMentorApplicationDto,
) {
  @IsNotEmpty()
  @IsEnum(MentorApplicationStatus)
  @IsOptional()
  status: MentorApplicationStatus;
}
