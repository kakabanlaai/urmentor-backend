import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EducationsService } from './educations.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { Roles } from '../iam/authentication/decorators/role.decorator';
import { Role } from '../users/enums/role.enum';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

@Roles(Role.Admin)
@Controller('educations')
export class EducationsController {
  constructor(private readonly educationsService: EducationsService) {}

  @Post()
  create(
    @Body() createEducationDto: CreateEducationDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.educationsService.create(createEducationDto, user.sub);
  }

  @Get()
  findAll() {
    return this.educationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.educationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEducationDto: UpdateEducationDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.educationsService.update(+id, updateEducationDto, user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.educationsService.remove(+id);
  }
}
