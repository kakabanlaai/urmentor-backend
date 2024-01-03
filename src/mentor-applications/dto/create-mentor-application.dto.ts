import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMentorApplicationDto {
  @IsNotEmpty()
  @IsString()
  introduction: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  cv: string;
}
