import { Test, TestingModule } from '@nestjs/testing';
import { ComicStoryController } from './comic-story.controller';

describe('ComicStoryController', () => {
  let controller: ComicStoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComicStoryController],
    }).compile();

    controller = module.get<ComicStoryController>(ComicStoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
