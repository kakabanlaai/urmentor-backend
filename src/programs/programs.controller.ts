import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { Role } from 'src/users/enums/role.enum';
import { Roles } from 'src/iam/authentication/decorators/role.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

@Roles(Role.Admin)
@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Roles(Role.Mentor)
  @Post()
  create(
    @Body() createProgramDto: CreateProgramDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.programsService.create(createProgramDto, user.sub);
  }

  @Get()
  findAll() {
    return this.programsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.programsService.findOne(+id);
  }

  @Roles(Role.Mentor)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProgramDto: UpdateProgramDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.programsService.update(+id, updateProgramDto, user.sub);
  }

  @Roles(Role.Mentor)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.programsService.remove(+id);
  }
}
