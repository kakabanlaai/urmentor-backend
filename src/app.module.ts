import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { IamModule } from './iam/iam.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './database/database.module';
import { MailerProvider } from './provider/mailer.provider';
import { RedisProvider } from './provider/redis.provider';
import userConfig from './config/user.config';
import { MentorProfilesModule } from './mentor-profiles/mentor-profiles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        //database
        PG_CONNECTION_STRING: Joi.string().required(),
        //jwt
        JWT_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_TTL: Joi.string().required(),
        JWT_REFRESH_TOKEN_TTL: Joi.string().required(),
        //google
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        //redis
        REDIS_URL: Joi.string().required(),
        //mail
        MAIL_SERVICE: Joi.string().required(),
        MAIL_USER: Joi.string().required(),
        MAIL_PASSWORD: Joi.string().required(),
        MAIL_PORT: Joi.number().required(),
        //common
        VERIFY_MAIL_TOKEN_TTL: Joi.string().required(),
        RECOVERY_PASSWORD_TOKEN_TTL: Joi.string().required(),
      }),
      load: [userConfig],
    }),
    MailerProvider,
    RedisProvider,
    DatabaseModule,
    UsersModule,
    MentorProfilesModule,
    IamModule,
  ],
})
export class AppModule {}
