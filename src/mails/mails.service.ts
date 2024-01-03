import { MailerService } from '@nestjs-modules/mailer';
import { MailData } from './types/mails.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailsService {
  constructor(private readonly mailerService: MailerService) {}

  async confirmRegisterUser(
    mailData: MailData<{ code: string; ttl: number }>,
  ): Promise<void> {
    await this.mailerService.sendMail({
      from: 'urMentor.com',
      to: mailData.to,
      subject: 'Email Verification',

      text: `This is email verification code: ${
        mailData.data.code
      } expired in ${mailData.data.ttl / 3600} hour`,
    });
  }

  async forgotPassword(
    mailData: MailData<{ code: string; ttl: number }>,
  ): Promise<void> {
    await this.mailerService.sendMail({
      from: 'urMentor.com',
      to: mailData.to,
      subject: 'Password reset',

      text: `This is reset password code: ${mailData.data.code} expired in ${
        mailData.data.ttl / 3600
      } hour`,
    });
  }

  async rejectMentorApplication(mailData: MailData): Promise<void> {
    await this.mailerService.sendMail({
      from: 'urMentor.com',
      to: mailData.to,
      subject: 'Rejected mentor application',

      text: `Your mentor application has been rejected.`,
    });
  }

  async acceptMentorApplication(mailData: MailData): Promise<void> {
    await this.mailerService.sendMail({
      from: 'urMentor.com',
      to: mailData.to,
      subject: 'Accepted mentor application',

      text: `Your mentor application has been accepted.`,
    });
  }
}
