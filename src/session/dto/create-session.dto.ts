import { IsDate, IsNumber } from 'class-validator';

export class CreateSessionDto {
  @IsDate()
  start: Date;

  @IsDate()
  end: Date;

  @IsNumber()
  userId: number;
}
