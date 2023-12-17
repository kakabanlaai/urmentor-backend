import { NotFoundException } from '@nestjs/common';

class UserNotFoundException extends NotFoundException {
  constructor(postId: number) {
    super(`User with id ${postId} not found`);
  }
}

export default UserNotFoundException;
