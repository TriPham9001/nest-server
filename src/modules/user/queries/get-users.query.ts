import { IQuery } from '@nestjs/cqrs';
import { FindManyOptions } from 'typeorm';
import { UserEntity } from '../user.entity';
import { UserPageOptionsDto } from '../dtos/user-page-options.dto';

export class GetUsersQuery implements IQuery {
  constructor(
    public readonly findData: FindManyOptions<UserEntity>,
    public readonly isPaging: boolean,
    public readonly dto: UserPageOptionsDto,
  ) {}
}
