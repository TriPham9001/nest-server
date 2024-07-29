import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { FindManyOptions } from 'typeorm';
import { ComicStoryEntity } from './comic-story.entity';
import { ComicStoryPageOptionsDto } from './dtos/comic-story-page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { ComicStoryDto } from './dtos/comic-story.dto';
import { GetComicStoriesQuery } from './queries/get-comic-stories.query';

@Injectable()
export class ComicStoryService {
  constructor(private queryBus: QueryBus) {}

  find(
    conditions: FindManyOptions<ComicStoryEntity>,
    isPaging: boolean,
    comicStoryPageOptionsDto?: ComicStoryPageOptionsDto,
  ): Promise<ComicStoryEntity[] | PageDto<ComicStoryDto>> {
    return this.queryBus.execute(
      new GetComicStoriesQuery(conditions, isPaging, comicStoryPageOptionsDto),
    );
  }
}
