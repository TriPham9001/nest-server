import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from 'src/shared/services/logger.service';
import { CreateBlogCommand } from '../create-blog.command';
import { BlogEntity } from '../../blog.entity';

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
    private readonly _loggerService: LoggerService,
  ) {}

  async execute({
    createBlogRequestDto,
  }: CreateBlogCommand): Promise<BlogEntity> {
    this._loggerService.log('[command] Async CreateBlogCommand');
    return this.blogRepository.save(
      this.blogRepository.create(createBlogRequestDto),
    );
  }
}
