import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { User } from 'src/users/entities/user.entity';
import { SessionRegister } from 'src/session-register/entities/session-register.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session, User, SessionRegister])],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
