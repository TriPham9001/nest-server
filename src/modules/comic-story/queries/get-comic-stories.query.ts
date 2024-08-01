import { FindManyOptions } from 'typeorm';
import { ComicStoryEntity } from '../comic-story.entity';
import { ComicStoryPageOptionsDto } from '../dtos/comic-story-page-options.dto';

export class GetComicStoriesQuery {
  constructor(
    public readonly findData: FindManyOptions<ComicStoryEntity>,
    public readonly isPaging: boolean,
    public readonly comicStoryPageOptionsDto?: ComicStoryPageOptionsDto,
  ) {}
}
