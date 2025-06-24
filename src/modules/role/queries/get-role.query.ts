import { FindOneOptions } from 'typeorm';
import { RoleEntity } from '../role.entity';

export class GetRoleQuery {
  constructor(public readonly findData: FindOneOptions<RoleEntity>) {}
}
