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
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
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
  async getComicStories(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ComicStoryDto>> {
    const comicStories = (await this.comicStoryService.find(
      {
        where: {},
      },
      true,
      pageOptionsDto,
    )) as PageDto<ComicStoryDto>;

    await Promise.all(
      (comicStories as PageDto<ComicStoryDto>).data.map(async (data) => {
        data.avatar = await this.supabaseService.getImageUrl(
          `avatars/${data.avatar}`,
        );
        data.cover_picture = await this.supabaseService.getImageUrl(
          `covers/${data.cover_picture}`,
        );
      }),
    );

    return comicStories;
  }
}
