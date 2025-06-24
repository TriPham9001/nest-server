import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LoggerService } from '../../../../shared/services/logger.service';
import { GetUserQuery } from '../get-user.query';
import { UserEntity } from '../../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly _logger: LoggerService,
  ) {}

  execute({ findData }: GetUserQuery): Promise<UserEntity> {
    this._logger.log('[query] Async GetUserQuery...');
    return this.userRepository.findOne(findData);
  }
}
