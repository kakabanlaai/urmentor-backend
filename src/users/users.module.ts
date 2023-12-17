import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MeController, UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ApiKey } from './api-keys/entities/api-key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ApiKey])],
  controllers: [UsersController, MeController],
  providers: [UsersService],
})
export class UsersModule {}
