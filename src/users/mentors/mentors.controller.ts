import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { MentorsService } from './mentors.service';

@Auth(AuthType.None)
@ApiTags('mentors')
@Controller('mentors')
@UseInterceptors(ClassSerializerInterceptor)
export class MentorsController {
  constructor(private readonly mentorsService: MentorsService) {}

  @Get()
  getMentors() {
    return this.mentorsService.getMentors();
  }
}
