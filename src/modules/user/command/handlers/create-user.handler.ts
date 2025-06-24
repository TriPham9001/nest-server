import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../create-user.command';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../user.entity';
import { Repository } from 'typeorm';
import { Provider } from '../../../../constants/token.constant';
import { LoggerService } from 'src/shared/services/logger.service';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly loggerService: LoggerService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute({
    registerDto,
    provider,
  }: CreateUserCommand): Promise<UserEntity> {
    this.loggerService.log('[command] Async CreateUserCommand...');

    const user = await this.userRepository.save(
      this.userRepository.create({
        ...registerDto,
        password: provider === Provider.LOCAL ? registerDto.password : null,
        needPasswordChange: provider === Provider.LOCAL ? false : true,
        lastLoginAt: provider !== Provider.LOCAL ? new Date() : null,
      }),
    );

    const userEntity = this.publisher.mergeObjectContext(user);
    userEntity.commit();

    return user;
  }
}
