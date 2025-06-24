import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UserEntity } from '../user.entity';
import { FindOptionsWhere } from 'typeorm';

export class UpdateUserCommand {
  constructor(
    public readonly findData: FindOptionsWhere<UserEntity>,
    public readonly updateData: QueryDeepPartialEntity<UserEntity>,
  ) {}
}
