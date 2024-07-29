import { Test, TestingModule } from '@nestjs/testing';
import { ComicStoryService } from './comic-story.service';

describe('ComicStoryService', () => {
  let service: ComicStoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComicStoryService],
    }).compile();

    service = module.get<ComicStoryService>(ComicStoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
