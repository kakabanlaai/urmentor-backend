import { PartialType } from '@nestjs/swagger';
import { CreateSessionRegisterDto } from './create-session-register.dto';

export class UpdateSessionRegisterDto extends PartialType(CreateSessionRegisterDto) {}
