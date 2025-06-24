import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRolesQuery } from '../get-roles.query';
import { RoleEntity } from '../../role.entity';
import { Repository } from 'typeorm';
import { LoggerService } from 'src/shared/services/logger.service';
import { InjectRepository } from '@nestjs/typeorm';

@QueryHandler(GetRolesQuery)
export class GetRolesHandler implements IQueryHandler<GetRolesQuery> {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly _loggerService: LoggerService,
  ) {}

  async execute(): Promise<RoleEntity[]> {
    this._loggerService.log('[query] Async GetRolesQuery...');
    return this.roleRepository.find();
  }
}
