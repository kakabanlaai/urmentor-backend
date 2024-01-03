import { ActiveUser } from './../iam/decorators/active-user.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MentorApplicationsService } from './mentor-applications.service';
import { CreateMentorApplicationDto } from './dto/create-mentor-application.dto';
import { UpdateMentorApplicationDto } from './dto/update-mentor-application.dto';
import { Role } from 'src/users/enums/role.enum';
import { Roles } from 'src/iam/authentication/decorators/role.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

@Roles(Role.Admin)
@Controller('mentor-applications')
export class MentorApplicationsController {
  constructor(
    private readonly mentorApplicationsService: MentorApplicationsService,
  ) {}

  @Roles(Role.Mentee, Role.Admin)
  @Post()
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createMentorApplicationDto: CreateMentorApplicationDto,
  ) {
    return this.mentorApplicationsService.create(
      createMentorApplicationDto,
      user.sub,
    );
  }

  @Get()
  findAll() {
    return this.mentorApplicationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mentorApplicationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMentorApplicationDto: UpdateMentorApplicationDto,
  ) {
    return this.mentorApplicationsService.update(
      +id,
      updateMentorApplicationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mentorApplicationsService.remove(+id);
  }
}
