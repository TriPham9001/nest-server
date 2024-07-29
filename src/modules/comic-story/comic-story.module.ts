import { Module } from '@nestjs/common';
import { ComicStoryService } from './comic-story.service';
import { ComicStoryController } from './comic-story.controller';

@Module({
  providers: [ComicStoryService],
  controllers: [ComicStoryController]
})
export class ComicStoryModule {}
