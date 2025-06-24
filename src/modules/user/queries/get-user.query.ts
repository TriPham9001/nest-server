import { IQuery } from '@nestjs/cqrs';
import { FindOneOptions } from 'typeorm';
import { UserEntity } from '../user.entity';

export class GetUserQuery implements IQuery {
  constructor(public readonly findData: FindOneOptions<UserEntity>) {}
}
