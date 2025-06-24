import { FindManyOptions } from 'typeorm';
import { BlogEntity } from '../blog.entity';
import { BlogPageOptionsDto } from '../dtos/blog-page-option.dto';

export class GetBlogsQuery {
  constructor(
    public readonly findData: FindManyOptions<BlogEntity>,
    public readonly isPaging: boolean,
    public readonly blogPageOptionsDto?: BlogPageOptionsDto,
  ) {}
}
