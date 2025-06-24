import { FindOptionsWhere } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BlogEntity } from '../blog.entity';

export class UpdateBlogCommand {
  constructor(
    public readonly findData: FindOptionsWhere<BlogEntity>,
    public readonly updateData: QueryDeepPartialEntity<BlogEntity>,
  ) {}
}
