import { AbstractDto } from 'src/common/dto/abstract.dto';
import { NumberField, StringField } from 'src/decorators/field.decorator';
import { ComicStoryEntity } from '../comic-story.entity';

export class ComicStoryDto extends AbstractDto {
  @StringField()
  avatar: string;

  @StringField()
  cover_picture: string;

  @StringField()
  name: string;

  @StringField()
  language: string;

  @NumberField()
  number_of_chapters: number;

  @NumberField()
  number_of_seasons: number;

  @StringField()
  description: string;

  @NumberField()
  status: number;

  @NumberField()
  maturity_rating_id: number;

  constructor(comicStory: ComicStoryEntity) {
    super(comicStory);
    this.name = comicStory.name;
    this.description = comicStory.description;
    this.avatar = comicStory.avatar;
    this.status = comicStory.status;
    this.language = comicStory.language;
    this.cover_picture = comicStory.cover_picture;
    this.number_of_seasons = comicStory.number_of_seasons;
    this.maturity_rating_id = comicStory.maturity_rating_id;
    this.number_of_chapters = comicStory.number_of_chapters;
  }
}
