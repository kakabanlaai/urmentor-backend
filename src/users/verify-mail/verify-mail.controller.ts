import { VerifyMailService } from './verify-mail.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Auth } from '../../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../../iam/authentication/enums/auth-type.enum';
import { ApiTags } from '@nestjs/swagger';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { VerifyMailDto } from './dtos/verify-mail.dto/verify-mail.dto';

@ApiTags('verify-mail')
@Controller('users')
@Auth(AuthType.Bearer)
export class VerifyMailController {
  constructor(private readonly verifyMailService: VerifyMailService) {}

  @HttpCode(HttpStatus.CREATED)
  @Get('verification')
  sendVerificationMail(@ActiveUser() user: ActiveUserData) {
    return this.verifyMailService.sendVerificationMail(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verification')
  verifyMail(
    @Body() verifyMailDto: VerifyMailDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.verifyMailService.verifyMail(user, verifyMailDto.code);
  }
}
