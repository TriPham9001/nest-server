import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { LoggerService } from 'src/shared/services/logger.service';
import { UpdateBlogCommand } from '../update-blog.command';
import { BlogEntity } from '../../blog.entity';

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogHandler implements ICommandHandler<UpdateBlogCommand> {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
    private readonly _loggerService: LoggerService,
  ) {}

  execute({ findData, updateData }: UpdateBlogCommand): Promise<UpdateResult> {
    this._loggerService.log('[command] Async UpdateBlogCommand...');
    return this.blogRepository.update(findData, updateData);
  }
}
