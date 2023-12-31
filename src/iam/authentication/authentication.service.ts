import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import {
  InvalidatedRefreshTokenError,
  RefreshTokenIdsStorage,
} from './refresh-token-ids.storage';
import * as crypto from 'crypto';
import PostgresErrorCode from 'src/database/postgresErrorCodes.enum';
import { HashingService } from '../../hashing/hashing.service';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      const hashedPassword = await this.hashingService.hash(signUpDto.password);

      const user = new User();
      Object.assign(user, { ...signUpDto, password: hashedPassword });

      await this.userRepository.save(user);

      const tokenObj = await this.generateTokens(user);
      return Object.assign(user, tokenObj);
    } catch (err) {
      if (err.code === PostgresErrorCode.UniqueViolation) {
        throw new ConflictException();
      }

      throw err;
    }
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: signInDto.email,
      },
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
        sessions: {
          sessionRegisters: true,
        },
        sessionRegisters: {
          program: {
            user: true,
            topic: true,
          },
          session: true,
          mentee: true,
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }

    if (user.password === null) {
      throw new BadRequestException('Wrong credentials provided');
    }

    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );

    if (!isEqual) {
      throw new BadRequestException('Wrong credentials provided');
    }

    const tokenObj = await this.generateTokens(user);
    return Object.assign(user, tokenObj);
  }

  async signOut(userId: number) {
    this.refreshTokenIdsStorage.invalidate(userId);
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
      });

      const user = await this.userRepository.findOneByOrFail({ id: sub });
      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );

      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(user.id);
      }

      return this.generateTokens(user);
    } catch (err) {
      if (err instanceof InvalidatedRefreshTokenError) {
        throw new UnauthorizedException('Access denied');
      }
      throw new UnauthorizedException(err.message);
    }
  }

  async generateTokens(user: User) {
    const refreshTokenId = crypto.randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        {
          email: user.email,
          role: user.role,
        },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);

    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.jwtConfiguration.secret,
        expiresIn: expiresIn,
      },
    );
  }
}
