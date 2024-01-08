import { Module } from '@nestjs/common';
import { SessionRegisterService } from './session-register.service';
import { SessionRegisterController } from './session-register.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionRegister } from './entities/session-register.entity';
import { Session } from 'src/session/entities/session.entity';
import { User } from 'src/users/entities/user.entity';
import { Program } from 'src/programs/entities/program.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionRegister, Session, User, Program]),
  ],
  controllers: [SessionRegisterController],
  providers: [SessionRegisterService],
})
export class SessionRegisterModule {}
