import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { LoggerService } from 'src/shared/services/logger.service';
import { FileEntity } from '../../file.entity';
import { DeleteFileCommand } from '../delete-file.command';

@CommandHandler(DeleteFileCommand)
export class DeleteFileHandler implements ICommandHandler<DeleteFileCommand> {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly _loggerService: LoggerService,
  ) {}

  async execute({ id }: DeleteFileCommand): Promise<DeleteResult> {
    this._loggerService.log('[command] Async DeleteFileCommand...');

    return this.fileRepository.delete(id);
  }
}
