import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MeController, UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ApiKey } from './api-keys/entities/api-key.entity';
import { VerifyMailController } from './verify-mail/verify-mail.controller';
import { ConfirmMailIdsStorage } from './verify-mail/verify-mail-ids.storage';
import { MailsService } from 'src/mails/mails.service';
import { VerifyMailService } from './verify-mail/verify-mail.service';
import { HashingModule } from '../hashing/hashing.module';
import { ForgotPasswordService } from './forgot-password/forgot-password.service';
import { ForgotPasswordController } from './forgot-password/forgot-password.controller';
import { ForgotPassword } from './forgot-password/entities/forgot-password.entity';
import { MentorsController } from './mentors/mentors.controller';
import { MentorsService } from './mentors/mentors.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ApiKey, ForgotPassword]),
    HashingModule,
  ],
  controllers: [
    VerifyMailController,
    ForgotPasswordController,
    UsersController,
    MeController,
    MentorsController,
  ],
  providers: [
    UsersService,
    ConfirmMailIdsStorage,
    MailsService,
    MentorsService,
    VerifyMailService,
    ForgotPasswordService,
  ],
})
export class UsersModule {}
