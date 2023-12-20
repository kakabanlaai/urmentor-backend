import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyMailDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}
