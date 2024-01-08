import { MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @MinLength(10)
  curPassword: string;

  @MinLength(10)
  newPassword: string;
}
