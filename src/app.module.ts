import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { IamModule } from './iam/iam.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PG_CONNECTION_STRING: Joi.string().required(),
        //jwt
        JWT_SECRET: Joi.string().required(),
        JWT_TOKEN_AUDIENCE: Joi.string().required(),
        JWT_TOKEN_ISSUER: Joi.string().required(),
        JWT_ACCESS_TOKEN_TTL: Joi.string().required(),
        JWT_REFRESH_TOKEN_TTL: Joi.string().required(),
        //google
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        //redis
        REDIS_URL: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    UsersModule,
    IamModule,
  ],
})
export class AppModule {}
