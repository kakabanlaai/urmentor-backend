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
import { SetPasswordDto } from './dto/set-password.dto';
import { HashingService } from 'src/hashing/hashing.service';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
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
        skills: true,
        ratings: {
          fromUser: true,
        },
      },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async setPassword(userId: number, body: SetPasswordDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.password) {
      throw new BadRequestException('Password already set');
    }

    const hashedPassword = await this.hashingService.hash(body.password);

    user.hasSetPass = true;
    user.password = hashedPassword;
    return this.userRepository.save(user);
  }

  async updatePassword(userId: number, body: UpdatePasswordDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.password) {
      throw new BadRequestException('Password not set');
    }

    const isEqual = await this.hashingService.compare(
      body.curPassword,
      user.password,
    );

    if (!isEqual) {
      throw new BadRequestException('Wrong credentials provided');
    }

    const hashedPassword = await this.hashingService.hash(body.newPassword);

    user.password = hashedPassword;
    return this.userRepository.save(user);
  }
}
