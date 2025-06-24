import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { RoleEntity } from './role.entity';
import { GetRolesQuery } from './queries/get-roles.query';
import { FindOneOptions } from 'typeorm';
import { GetRoleQuery } from './queries/get-role.query';

@Injectable()
export class RoleService {
  constructor(private queryBus: QueryBus) {}

  find(): Promise<RoleEntity[]> {
    return this.queryBus.execute(new GetRolesQuery());
  }

  findOne(conditions: FindOneOptions<RoleEntity>): Promise<RoleEntity> {
    return this.queryBus.execute(new GetRoleQuery(conditions));
  }
}
