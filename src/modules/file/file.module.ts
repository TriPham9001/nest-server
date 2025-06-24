import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { FileEntity } from './file.entity';
import { CommandHandlers } from './commands/handlers';

@Module({
  providers: [FileService, ...CommandHandlers],
  imports: [TypeOrmModule.forFeature([FileEntity]), CqrsModule],
  exports: [FileService],
})
export class FileModule {}
