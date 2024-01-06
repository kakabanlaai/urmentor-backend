import { BadRequestException, Injectable } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import UserNotFoundException from './exceptions/userNotFound.exception';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  async findAll(options: IPaginationOptions): Promise<Pagination<User>> {
    return paginate<User>(this.userRepository, options);
  }

  async findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const toUpdate = await this.userRepository.findOne({ where: { id } });
    if (!toUpdate) {
      throw new UserNotFoundException(id);
    }
    const updated = Object.assign(toUpdate, updateUserDto);
    return await this.userRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const deleteResponse = await this.userRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new UserNotFoundException(id);
    }
  }

  async restore(id: number) {
    const restoreResponse = await this.userRepository.restore(id);
    if (!restoreResponse.affected) {
      throw new UserNotFoundException(id);
    }
  }

  async getMe(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        experiences: true,
        achievements: true,
        educations: true,
        mentorApplication: true,
      },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }
}
