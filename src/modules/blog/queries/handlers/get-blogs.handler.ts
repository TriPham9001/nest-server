import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { PageDto } from 'src/common/dto/page.dto';
import { LoggerService } from 'src/shared/services/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { GetBlogsQuery } from '../get-blogs.query';
import { BlogEntity } from '../../blog.entity';
import { BlogDto } from '../../dtos/blog.dto';

@QueryHandler(GetBlogsQuery)
export class GetBlogsHandler implements IQueryHandler<GetBlogsQuery> {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
    private readonly _loggerService: LoggerService,
  ) {}

  async execute({
    findData,
    isPaging,
    blogPageOptionsDto,
  }: GetBlogsQuery): Promise<BlogEntity[] | PageDto<BlogDto>> {
    this._loggerService.log('[query] Async GetBlogsQuery...');

    if (isPaging) {
      const queryBuilder = this.blogRepository.createQueryBuilder('blogs');

      const qB = queryBuilder.where(findData.where);

      //check exist findData relations and convert findData relations to array
      if (findData.relations) {
        const relations = Object.values(findData.relations);

        if (relations) {
          relations.forEach((relation) => {
            qB.leftJoinAndSelect(`blogs.${relation}`, relation);
          });
        }
      }

      const [items, pageMetaDto] = await qB.paginate(blogPageOptionsDto);

      return items.toPageDto(pageMetaDto);
    }
    return this.blogRepository.find(findData);
  }
}
