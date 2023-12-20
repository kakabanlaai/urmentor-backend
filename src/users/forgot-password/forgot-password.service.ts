import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ForgotPassword } from './entities/forgot-password.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { MailsService } from '../../mails/mails.service';
import userConfig from '../../config/user.config';
import { ConfigType } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { HashingService } from '../../hashing/hashing.service';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectRepository(ForgotPassword)
    private readonly forgotPasswordRepository: Repository<ForgotPassword>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailsService: MailsService,
    @Inject(userConfig.KEY)
    private readonly userConfiguration: ConfigType<typeof userConfig>,
    private readonly hashingService: HashingService,
  ) {}

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const code = crypto.randomUUID();
    await this.forgotPasswordRepository.save({
      code,
      user,
    });

    await this.mailsService.forgotPassword({
      to: email,
      data: {
        code,
        ttl: this.userConfiguration.recoveryPassTtl,
      },
    });
  }

  async resetPassword(code: string, password: string): Promise<void> {
    const forgotReq = await this.forgotPasswordRepository.findOne({
      where: {
        code,
      },
    });

    if (!forgotReq) {
      throw new BadRequestException('Invalid code');
    }

    const user = forgotReq.user;
    user.password = await this.hashingService.hash(password);

    await this.userRepository.save(user);
    await this.forgotPasswordRepository.softDelete({ code });
  }
}
