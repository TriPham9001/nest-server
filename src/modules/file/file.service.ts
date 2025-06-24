import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileEntity } from './file.entity';
import { CreateFileRequestDto } from './dtos/create-file-request.dto';
import { CreateFilesCommand } from './commands/create-file.command';
import { DeleteFileCommand } from './commands/delete-file.command';
import { DeleteResult } from 'typeorm';

@Injectable()
export class FileService {
  constructor(private commandBus: CommandBus) {}

  async uploadFiles(
    files: Express.Multer.File[],
    path: string,
  ): Promise<FileEntity[]> {
    const createFileRequestDtos: CreateFileRequestDto[] = files.map((file) => {
      return {
        file,
        path,
      };
    });

    return this.commandBus.execute(
      new CreateFilesCommand(createFileRequestDtos),
    );
  }

  delete(id: Uuid): Promise<DeleteResult> {
    return this.commandBus.execute(new DeleteFileCommand(id));
  }
}
