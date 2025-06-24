import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from 'src/shared/services/logger.service';
import { GetBlogQuery } from '../get-blog.query';
import { BlogEntity } from '../../blog.entity';

@QueryHandler(GetBlogQuery)
export class GetBlogHandler implements IQueryHandler<GetBlogQuery> {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
    private readonly _loggerService: LoggerService,
  ) {}

  async execute({ findData }: GetBlogQuery): Promise<BlogEntity> {
    this._loggerService.log('[query] Async GetBlogQuery...');
    return this.blogRepository.findOne(findData);
  }
}
