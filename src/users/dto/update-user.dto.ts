import { IsNotEmpty, Length } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

class NonOptionalUpdateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Length(10, 10, { message: 'Phone number must be 10 digits' })
  phoneNumber: string;

  @IsNotEmpty()
  avatar: string;

  @IsNotEmpty()
  introduction: string;
}

export class UpdateUserDto extends PartialType(NonOptionalUpdateUserDto) {}
