import {
  ConflictException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { AuthenticationService } from '../authentication.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';
import { google } from 'googleapis';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthenticationService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  onModuleInit() {
    const clientId = this.configService.get('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  async authenticate(token: string) {
    try {
      const { sub: googleId, email } =
        await this.oauthClient.getTokenInfo(token);

      const user = await this.userRepository.findOne({
        where: { email },
        relations: {
          experiences: true,
          achievements: true,
          educations: true,
          mentorApplication: true,
          skills: true,
          ratings: {
            fromUser: true,
          },
          programs: {
            topic: true,
          },
          sessions: true,
          sessionRegisters: {
            program: true,
            session: true,
            mentee: true,
          },
        },
      });
      if (user) {
        user.googleId = googleId;
        await this.userRepository.save(user);
        const tokenObj = await this.authService.generateTokens(user);

        return Object.assign(user, tokenObj);
      } else {
        const { email, name, picture: avatar } = await this.getUserData(token);

        const newUser = await this.userRepository.save({
          email,
          googleId,
          name,
          avatar,
          hasSetPass: false,
          isActive: true,
        });
        const tokenObj = await this.authService.generateTokens(newUser);
        return Object.assign(newUser, tokenObj);
      }
    } catch (error) {
      if (error.code === PostgresErrorCode.UniqueViolation) {
        throw new ConflictException('Email already exists');
      }
      console.log(error);

      throw new UnauthorizedException();
    }
  }

  async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oauthClient.setCredentials({
      access_token: token,
    });

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    });

    return userInfoResponse.data;
  }
}
