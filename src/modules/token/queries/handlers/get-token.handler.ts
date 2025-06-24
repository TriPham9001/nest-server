import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTokenQuery } from '../get-token.query';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from '../../token.entity';
import { Repository } from 'typeorm';
import { LoggerService } from 'src/shared/services/logger.service';

@QueryHandler(GetTokenQuery)
export class GetTokenHandler implements IQueryHandler<GetTokenQuery> {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
    private readonly _logger: LoggerService,
  ) {}

  execute({ findData }: GetTokenQuery): Promise<TokenEntity> {
    this._logger.log('[query] Async GetTokenQuery...');
    return this.tokenRepository.findOne(findData);
  }
}
