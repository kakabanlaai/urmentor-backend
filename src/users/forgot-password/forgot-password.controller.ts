import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ForgotPasswordService } from './forgot-password.service';
import { ResetPasswordDto } from './dtos/reset-password.dot';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';

@Auth(AuthType.None)
@ApiTags('forgot-password')
@Controller('users')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.forgotPasswordService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.forgotPasswordService.resetPassword(
      resetPasswordDto.code,
      resetPasswordDto.password,
    );
  }
}
