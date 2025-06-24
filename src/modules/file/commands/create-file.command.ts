import { CreateFileRequestDto } from '../dtos/create-file-request.dto';

export class CreateFilesCommand {
  constructor(public readonly createFileRequestDtos: CreateFileRequestDto[]) {}
}
