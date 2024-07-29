import { Module } from '@nestjs/common';
import { ComicStoryController } from './comic-story.controller';
import { ComicStoryService } from './comic-story.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComicStoryEntity } from './comic-story.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryHandlers } from './handlers';

@Module({
  controllers: [ComicStoryController],
  providers: [ComicStoryService, ...QueryHandlers],
  imports: [TypeOrmModule.forFeature([ComicStoryEntity]), CqrsModule],
})
export class ComicStoryModule {}
