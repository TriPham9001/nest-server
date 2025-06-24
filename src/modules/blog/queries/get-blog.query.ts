import { FindOneOptions } from 'typeorm';
import { BlogEntity } from '../blog.entity';

export class GetBlogQuery {
  constructor(public readonly findData: FindOneOptions<BlogEntity>) {}
}
