import { IsNotEmpty, IsString, Length } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

class NonOptionalUpdateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Length(10, 10, { message: 'Phone number must be 10 digits' })
  phoneNumber: string;

  @IsNotEmpty()
  avatar: string;

  @IsString()
  introduction: string;
}

export class UpdateUserDto extends PartialType(NonOptionalUpdateUserDto) {}
