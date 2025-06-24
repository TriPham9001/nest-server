import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { LoggerService } from 'src/shared/services/logger.service';
import { DeleteUserCommand } from '../delete-user.command';
import { UserEntity } from '../../user.entity';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly _loggerService: LoggerService,
  ) {}

  async execute({ id, hardDelete }: DeleteUserCommand): Promise<DeleteResult> {
    this._loggerService.log('[command] Async DeleteUserCommand...');
    if (hardDelete) {
      return this.userRepository.delete(id);
    } else {
      return this.userRepository.softDelete(id);
    }
  }
}
