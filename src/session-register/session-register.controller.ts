import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SessionRegisterService } from './session-register.service';
import { CreateSessionRegisterDto } from './dto/create-session-register.dto';
import { UpdateSessionRegisterDto } from './dto/update-session-register.dto';

@Controller('session-register')
export class SessionRegisterController {
  constructor(
    private readonly sessionRegisterService: SessionRegisterService,
  ) {}

  @Post()
  create(@Body() createSessionRegisterDto: CreateSessionRegisterDto) {
    return this.sessionRegisterService.create(createSessionRegisterDto);
  }

  @Get()
  findAll() {
    return this.sessionRegisterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionRegisterService.findOne(+id);
  }

  @Post(':id/accept')
  accept(@Param('id') id: string) {
    return this.sessionRegisterService.accept(+id);
  }

  @Post(':id/done')
  done(@Param('id') id: string) {
    return this.sessionRegisterService.done(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSessionRegisterDto: UpdateSessionRegisterDto,
  ) {
    return this.sessionRegisterService.update(+id, updateSessionRegisterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionRegisterService.remove(+id);
  }
}
