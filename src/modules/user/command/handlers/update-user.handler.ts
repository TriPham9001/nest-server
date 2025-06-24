import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../update-user.command';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { LoggerService } from 'src/shared/services/logger.service';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly loggerService: LoggerService,
  ) {}

  execute({ findData, updateData }: UpdateUserCommand): Promise<UpdateResult> {
    this.loggerService.log('[command] Async UpdateUserCommand...');
    return this.userRepository.update(findData, updateData);
  }
}
