import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './blog.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryHandlers } from './queries/handlers';
import { CommandHandlers } from './commands/handler';
import { FileModule } from '../file/file.module';

@Module({
  providers: [BlogService, ...QueryHandlers, ...CommandHandlers],
  controllers: [BlogController],
  imports: [TypeOrmModule.forFeature([BlogEntity]), CqrsModule, FileModule],
  exports: [BlogService],
})
export class BlogModule {}
