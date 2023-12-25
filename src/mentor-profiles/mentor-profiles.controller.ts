import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MentorProfilesService } from './mentor-profiles.service';
import { CreateMentorProfileDto } from './dto/create-mentor-profile.dto';
import { UpdateMentorProfileDto } from './dto/update-mentor-profile.dto';

@Controller('mentor-profiles')
export class MentorProfilesController {
  constructor(private readonly mentorProfilesService: MentorProfilesService) {}

  @Post()
  create(@Body() createMentorProfileDto: CreateMentorProfileDto) {
    return this.mentorProfilesService.create(createMentorProfileDto);
  }

  @Get()
  findAll() {
    return this.mentorProfilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mentorProfilesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMentorProfileDto: UpdateMentorProfileDto) {
    return this.mentorProfilesService.update(+id, updateMentorProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mentorProfilesService.remove(+id);
  }
}
