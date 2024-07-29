import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from 'src/shared/services/logger.service';
import { PageDto } from 'src/common/dto/page.dto';
import { GetComicStoriesQuery } from '../queries/get-comic-stories.query';
import { ComicStoryEntity } from '../comic-story.entity';
import { ComicStoryDto } from '../dtos/comic-story.dto';

@QueryHandler(GetComicStoriesQuery)
export class GetComicStoriesHandler
  implements IQueryHandler<GetComicStoriesQuery>
{
  constructor(
    @InjectRepository(ComicStoryEntity)
    private readonly comicStoryRepository: Repository<ComicStoryEntity>,
    private readonly _loggerService: LoggerService,
  ) {}

  async execute({
    findData,
    isPaging,
    comicStoryPageOptionsDto,
  }: GetComicStoriesQuery): Promise<
    ComicStoryEntity[] | PageDto<ComicStoryDto>
  > {
    this._loggerService.log('[query] Async GetComicStoriesQuery...');
    if (isPaging) {
      const queryBuilder =
        this.comicStoryRepository.createQueryBuilder('comic_stories');

      queryBuilder.where(findData.where);

      // Check if relations are provided and join them
      if (findData.relations) {
        const relations = Object.values(findData.relations);

        relations.forEach((relation) => {
          queryBuilder.leftJoinAndSelect(`comic_stories.${relation}`, relation);
        });
      }

      // Ensure the paginate method is defined
      if (typeof queryBuilder.paginate !== 'function') {
        throw new Error('paginate method is not defined on the query builder');
      }

      const [items, pageMetaDto] = await queryBuilder.paginate(
        comicStoryPageOptionsDto,
      );

      return items.toPageDto(pageMetaDto, ComicStoryDto);
    }

    const results = await this.comicStoryRepository.find(findData);
    return results;
  }
}
