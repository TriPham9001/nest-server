import { AbstractDto } from '../../../common/dto/abstract.dto';
import { StringField } from 'src/decorators/field.decorator';
import { BlogEntity } from '../blog.entity';

export class BlogDto extends AbstractDto {
  @StringField()
  description: string;

  @StringField()
  name: string;

  @StringField()
  content: string;

  @StringField()
  slug: string;

  constructor(blog: BlogEntity) {
    super(blog);
    this.name = blog.name;
    this.description = blog.description;
    this.content = blog.content;
    this.slug = blog.slug;
  }
}
