import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRoleQuery } from '../get-role.query';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '../../role.entity';
import { Repository } from 'typeorm';
import { LoggerService } from 'src/shared/services/logger.service';

@QueryHandler(GetRoleQuery)
export class GetRoleHandler implements IQueryHandler<GetRoleQuery> {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly _loggerService: LoggerService,
  ) {}

  async execute({ findData }: GetRoleQuery): Promise<RoleEntity> {
    this._loggerService.log('[query] Async GetRoleQuery...');
    return this.roleRepository.findOne(findData);
  }
}
