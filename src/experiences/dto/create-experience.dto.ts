import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  @IsOptional()
  endDate?: Date;

  @IsString()
  company: string;
}
