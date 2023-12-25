import { IsNotEmpty } from 'class-validator';

export class CreateMentorProfileDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  linkedin?: string;

  @IsNotEmpty()
  cv?: string;
}
