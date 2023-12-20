import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import userConfig from 'src/config/user.config';
import {
  ConfirmMailIdsStorage,
  InvalidatedRefreshTokenError,
} from './verify-mail-ids.storage';
import { ConfigType } from '@nestjs/config';
import { MailsService } from 'src/mails/mails.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VerifyMailService {
  constructor(
    private readonly confirmMailIdsStorage: ConfirmMailIdsStorage,
    @Inject(userConfig.KEY)
    private readonly userConfiguration: ConfigType<typeof userConfig>,
    private readonly mailsService: MailsService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async sendVerificationMail(user: ActiveUserData) {
    const code = crypto.randomUUID();
    await this.confirmMailIdsStorage.insert(
      user.sub,
      code,
      this.userConfiguration.verifyMailTtl,
    );

    await this.mailsService.confirmRegisterUser({
      to: user.email,
      data: { code, ttl: this.userConfiguration.verifyMailTtl },
    });
  }

  async verifyMail(user: ActiveUserData, code: string) {
    try {
      const isValid = await this.confirmMailIdsStorage.validate(user.sub, code);

      if (isValid) {
        await this.confirmMailIdsStorage.invalidate(user.sub);
      }

      await this.userRepository.update({ id: user.sub }, { isActive: true });
    } catch (error) {
      if (error instanceof InvalidatedRefreshTokenError) {
        throw new BadRequestException('Incorrect code');
      }

      throw new BadRequestException(error.message);
    }
  }
}
