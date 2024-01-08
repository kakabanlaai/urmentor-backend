import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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

  @IsBoolean()
  @IsOptional()
  isCurrent: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  icon?: string;
}
