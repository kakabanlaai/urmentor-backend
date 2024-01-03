import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAchievementDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
