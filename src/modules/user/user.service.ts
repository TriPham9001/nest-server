import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  UpdateResult,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { UserPageOptionsDto } from './dtos/user-page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { UserDto } from './dtos/user.dto';
import { GetUsersQuery } from './queries/get-users.query';
import { GetUserQuery } from './queries/get-user.query';
import { Transactional } from 'typeorm-transactional';
import { RegisterRequestDto } from '../auth/dtos/register-request';
import { Provider } from '../../constants/token.constant';
import { CreateUserCommand } from './command/create-user.command';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpdateUserCommand } from './command/update-user.command';
import { DeleteUserCommand } from './command/delete-user.command';

@Injectable()
export class UserService {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  find(
    conditions: FindManyOptions<UserEntity>,
    isPaging: boolean = false,
    dto?: UserPageOptionsDto,
  ): Promise<UserEntity[] | PageDto<UserDto>> {
    return this.queryBus.execute(new GetUsersQuery(conditions, isPaging, dto));
  }

  findOne(conditions: FindOneOptions<UserEntity>): Promise<UserEntity> {
    return this.queryBus.execute(new GetUserQuery(conditions));
  }

  @Transactional()
  async createUser(
    registerDto: RegisterRequestDto,
    provider = Provider.LOCAL,
  ): Promise<UserEntity> {
    const user = await this.commandBus.execute(
      new CreateUserCommand(registerDto, provider),
    );

    return user;
  }

  async update(
    findData: FindOptionsWhere<UserEntity>,
    updateData: QueryDeepPartialEntity<UserEntity>,
  ): Promise<UpdateResult> {
    return this.commandBus.execute(new UpdateUserCommand(findData, updateData));
  }

  delete(id: Uuid, hardDelete?: boolean): Promise<void> {
    return this.commandBus.execute(new DeleteUserCommand(id, hardDelete));
  }
}
