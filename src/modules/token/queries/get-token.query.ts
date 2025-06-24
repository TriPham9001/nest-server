import { IQuery } from '@nestjs/cqrs';
import { FindOneOptions } from 'typeorm';
import { TokenEntity } from '../token.entity';

export class GetTokenQuery implements IQuery {
  constructor(public readonly findData: FindOneOptions<TokenEntity>) {}
}
