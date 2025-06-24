import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  UpdateResult,
} from 'typeorm';
import { BlogEntity } from './blog.entity';
import { PageDto } from 'src/common/dto/page.dto';
import { BlogDto } from './dtos/blog.dto';
import { BlogPageOptionsDto } from './dtos/blog-page-option.dto';
import { GetBlogsQuery } from './queries/get-blogs.query';
import { GetBlogQuery } from './queries/get-blog.query';
import { CreateBlogCommand } from './commands/create-blog.command';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpdateBlogCommand } from './commands/update-blog.command';
import { DeleteBlogCommand } from './commands/delete-blog.command';
import { CreateBlogRequestDto } from './dtos/create-blog-request.dto';

@Injectable()
export class BlogService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  find(
    findData: FindManyOptions<BlogEntity>,
    isPaging: boolean,
    blogPageOptionsDto?: BlogPageOptionsDto,
  ): Promise<BlogEntity[] | PageDto<BlogDto>> {
    return this.queryBus.execute(
      new GetBlogsQuery(findData, isPaging, blogPageOptionsDto),
    );
  }

  findOne(findData: FindOneOptions<BlogEntity>): Promise<BlogEntity> {
    return this.queryBus.execute(new GetBlogQuery(findData));
  }

  create(createBlogRequestDto: CreateBlogRequestDto): Promise<BlogEntity> {
    return this.commandBus.execute(new CreateBlogCommand(createBlogRequestDto));
  }

  update(
    findData: FindOptionsWhere<BlogEntity>,
    updateData: QueryDeepPartialEntity<BlogEntity>,
  ): Promise<UpdateResult> {
    return this.commandBus.execute(new UpdateBlogCommand(findData, updateData));
  }

  delete(ids: Uuid[]): Promise<DeleteResult> {
    return this.commandBus.execute(new DeleteBlogCommand(ids));
  }
}
