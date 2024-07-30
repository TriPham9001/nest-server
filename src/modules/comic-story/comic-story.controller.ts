import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Version,
} from '@nestjs/common';
import { ComicStoryService } from './comic-story.service';
import { PageDto } from 'src/common/dto/page.dto';
import { ComicStoryDto } from './dtos/comic-story.dto';
import { SupabaseService } from 'src/shared/services/supabase-s3.service';
import { ResponseMessage } from 'src/decorators/response-message.decorator';

@Controller('comic-story')
export class ComicStoryController {
  constructor(
    private readonly comicStoryService: ComicStoryService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Version('1')
  @Get()
  @ResponseMessage('Comic Strories successfully fetched')
  @HttpCode(HttpStatus.OK)
  async getComicStories(): Promise<PageDto<ComicStoryDto>> {
    const comicStories = (await this.comicStoryService.find(
      {
        where: {},
      },
      false,
    )) as PageDto<ComicStoryDto>;

    return comicStories;
  }
}
