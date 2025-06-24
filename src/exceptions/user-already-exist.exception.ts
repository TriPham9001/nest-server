import { ConflictException } from '@nestjs/common';

export class UserAlreadyExistException extends ConflictException {
  constructor(error?: string) {
    super('error.userAlreadyExist', error);
  }
}
