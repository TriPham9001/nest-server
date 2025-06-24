import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { LoggerService } from 'src/shared/services/logger.service';
import { DeleteBlogCommand } from '../delete-blog.command';
import { BlogEntity } from '../../blog.entity';

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogHandler implements ICommandHandler<DeleteBlogCommand> {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
    private readonly _loggerService: LoggerService,
  ) {}

  async execute({ ids }: DeleteBlogCommand): Promise<DeleteResult> {
    this._loggerService.log('[command] Async DeleteBlogCommand...');

    return this.blogRepository.delete(ids);
  }
}
