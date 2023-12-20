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
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: token,
      });
      const {
        email,
        sub: googleId,
        name,
        picture: avatar,
      } = loginTicket.getPayload();
      const user = await this.userRepository.findOneBy({ googleId });
      if (user) {
        const tokenObj = await this.authService.generateTokens(user);

        return Object.assign(user, tokenObj);
      } else {
        const newUser = await this.userRepository.save({
          email,
          googleId,
          name,
          avatar,
          hasSetPass: false,
          isActive: true,
        });
        const tokenObj = await this.authService.generateTokens(user);
        return Object.assign(newUser, tokenObj);
      }
    } catch (error) {
      if (error.code === PostgresErrorCode.UniqueViolation) {
        throw new ConflictException('Email already exists');
      }

      throw new UnauthorizedException();
    }
  }
}
