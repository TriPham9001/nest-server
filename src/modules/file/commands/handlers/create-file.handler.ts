import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from '../../file.entity';
import { Repository } from 'typeorm';
import { LoggerService } from 'src/shared/services/logger.service';
import { CreateFileRequestDto } from '../../dtos/create-file-request.dto';
import { CreateFilesCommand } from '../create-file.command';
import { SupabaseService } from 'src/shared/services/supabase-s3.service';

@CommandHandler(CreateFilesCommand)
export class CreateFilesHandler implements IQueryHandler<CreateFilesCommand> {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly _loggetService: LoggerService,
    private readonly awsS3Service: SupabaseService,
  ) {}

  async execute({
    createFileRequestDtos,
  }: CreateFilesCommand): Promise<FileEntity[]> {
    this._loggetService.log('[command] Async CreateFilesCommand...');

    const files = await Promise.all(
      createFileRequestDtos.map(async (createFileRequestDto) => {
        return await this.uploadFile(createFileRequestDto);
      }),
    );

    return files;
  }

  async uploadFile(
    createFileRequestDto: CreateFileRequestDto,
  ): Promise<FileEntity> {
    const { file, path } = createFileRequestDto;

    // const filenameArr = file.originalname.split('.');
    // const filename = filenameArr.slice(0, filenameArr.length - 1).join('.');

    const fileResult = await this.awsS3Service.uploadImage(file, `${path}`);

    const newFile = this.fileRepository.create({
      fileName: fileResult.key,
      url: fileResult.url,
    });

    return this.fileRepository.save(newFile);
  }
}
