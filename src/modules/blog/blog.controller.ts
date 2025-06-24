import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Query,
  Post,
  Version,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { ResponseMessage } from '../../decorators/response-message.decorator';
import { UpdateBlogRequestDto } from './dtos/update-blog-request.dto';
import { BlogEntity } from './blog.entity';
import { Transactional } from 'typeorm-transactional';
import { FileService } from '../file/file.service';
import { DeleteResult, In } from 'typeorm';
import { CreateBlogRequestDto } from './dtos/create-blog-request.dto';
import { DeleteBlogRequestDto } from './dtos/delete-blog-request.dto';
import { BlogPageOptionsDto } from './dtos/blog-page-option.dto';
import { BlogDto } from './dtos/blog.dto';
import { PageDto } from 'src/common/dto/page.dto';

@Controller('blog')
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly fileService: FileService,
  ) {}

  @Version('1')
  @Get('')
  @ResponseMessage('Fetched blogs successfully')
  @HttpCode(HttpStatus.OK)
  async getBlogs(
    @Query() blogPageOptionsDto: BlogPageOptionsDto,
  ): Promise<BlogEntity[] | PageDto<BlogDto>> {
    const blogs = (await this.blogService.find(
      {
        where: {},
      },
      true,
      blogPageOptionsDto,
    )) as PageDto<BlogDto>;

    return blogs;
  }

  @Version('1')
  @Get(':blogSlug')
  @ResponseMessage('Fetched blogs successfully')
  @HttpCode(HttpStatus.OK)
  async getBlog(@Param('blogSlug') blogSlug: string): Promise<BlogEntity> {
    const blog = (await this.blogService.findOne({
      where: {
        slug: blogSlug,
      },
    })) as BlogEntity;

    return blog;
  }

  @Version('1')
  @Post()
  @ResponseMessage('Blog successfully created')
  @HttpCode(HttpStatus.OK)
  @Transactional()
  async createBlog(
    @Body() createBlogRequestDto: CreateBlogRequestDto,
  ): Promise<BlogEntity> {
    const existingBlog = await this.blogService.findOne({
      where: {
        name: createBlogRequestDto.name,
      },
    });

    if (existingBlog) {
      throw new BadRequestException('Blog already exists');
    }

    const blog = await this.blogService.create(createBlogRequestDto);
    return blog;
  }

  @Version('1')
  @Patch(':id')
  @ResponseMessage('Blog successfully updated')
  @HttpCode(HttpStatus.OK)
  @Transactional()
  async updateBlog(
    @Param('id') id: Uuid,
    @Body() updateBlogRequestDto: UpdateBlogRequestDto,
  ) {
    const blog = await this.blogService.findOne({
      where: {
        id,
      },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return this.blogService.update(
      { id },
      {
        name: updateBlogRequestDto.name,
        slug: updateBlogRequestDto.slug,
        content: updateBlogRequestDto.content,
      },
    );
  }

  @Version('1')
  @Delete()
  @ResponseMessage('Blog successfully deleted')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Transactional()
  async delete(
    @Body() deleteBlogRequestDto: DeleteBlogRequestDto,
  ): Promise<DeleteResult> {
    const { blogIds } = deleteBlogRequestDto;

    const blogs = (await this.blogService.find(
      {
        where: {
          id: In(blogIds),
        },
      },
      false,
    )) as BlogEntity[];

    const foundBlogIds = blogs.map((blog: BlogEntity) => blog.id);
    const invalidBlogIds = blogIds.filter((id) => !foundBlogIds.includes(id));

    if (invalidBlogIds.length > 0) {
      throw new NotFoundException(
        `Invalid manga IDs: ${invalidBlogIds.join(', ')}`,
      );
    }

    try {
      await Promise.all([
        blogs.length > 0 ? this.blogService.delete(blogIds) : Promise.resolve(),
      ]);
      return { affected: 0, raw: null };
    } catch (error) {
      throw new BadRequestException('Cannot delete manga');
    }
  }
}
