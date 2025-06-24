import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateEmailVerificationTokenCommand } from '../create-email-verification-token.command';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from '../../token.entity';
import { Repository } from 'typeorm';

@CommandHandler(CreateEmailVerificationTokenCommand)
export class CreateEmailVerificationTokenHandler
  implements ICommandHandler<CreateEmailVerificationTokenCommand>
{
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
  ) {}

  execute({
    token,
  }: CreateEmailVerificationTokenCommand): Promise<TokenEntity> {
    return this.tokenRepository.save(token);
  }
}
