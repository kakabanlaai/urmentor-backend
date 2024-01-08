import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSessionRegisterDto {
  @IsNumber()
  sessionId;

  @IsNumber()
  menteeId;

  @IsNumber()
  programId;

  @IsString()
  @IsNotEmpty()
  detail;
}
