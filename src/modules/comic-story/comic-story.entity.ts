import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity } from 'typeorm';
import { ComicStoryDto } from './dtos/comic-story.dto';
import { UseDto } from 'src/decorators/use-dto.decorator';

@Entity({ name: 'comic_stories' })
@UseDto(ComicStoryDto)
export class ComicStoryEntity extends AbstractEntity<ComicStoryDto> {
  @Column()
  avatar: string;

  @Column()
  cover_picture: string;

  @Column()
  name: string;

  @Column()
  language: string;

  @Column()
  number_of_chapters: number;

  @Column()
  number_of_seasons: number;

  @Column()
  description: string;

  @Column()
  status: number;

  @Column()
  maturity_rating_id: number;
}
