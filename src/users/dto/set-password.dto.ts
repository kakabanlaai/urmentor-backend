import { MinLength } from 'class-validator';

export class SetPasswordDto {
  @MinLength(10)
  password: string;
}
