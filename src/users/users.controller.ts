import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './enums/role.enum';
import { Roles } from 'src/iam/authentication/decorators/role.decorator';
import { ApiTags } from '@nestjs/swagger';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { User } from './entities/user.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { SetPasswordDto } from './dto/set-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Roles(Role.Admin)
@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Get()
  findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<Pagination<User>> {
    const { page, limit } = paginationQuery;
    return this.usersService.findAll({ limit, page });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}

@Controller('me')
@UseInterceptors(ClassSerializerInterceptor)
export class MeController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  me(@ActiveUser() user: ActiveUserData) {
    return this.usersService.getMe(user.sub);
  }

  @Patch()
  updateMe(
    @ActiveUser() user: ActiveUserData,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user.sub, updateUserDto);
  }

  @Patch('set-password')
  setPassword(
    @ActiveUser() user: ActiveUserData,
    @Body() setPasswordDto: SetPasswordDto,
  ) {
    return this.usersService.setPassword(user.sub, setPasswordDto);
  }

  @Patch('update-password')
  updatePassword(
    @ActiveUser() user: ActiveUserData,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(user.sub, updatePasswordDto);
  }
}
