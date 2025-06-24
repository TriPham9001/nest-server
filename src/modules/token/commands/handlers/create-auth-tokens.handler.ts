import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAuthTokensCommand } from '../create-auth-tokens.command';
import { CreateAuthTokensPayloadDto } from '../../dtos/create-auth-tokens-payload.dto';
import { TokenEntity } from '../../token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@CommandHandler(CreateAuthTokensCommand)
export class CreateAuthTokensHandler
  implements ICommandHandler<CreateAuthTokensCommand>
{
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
  ) {}

  async execute({
    accessToken,
    refreshToken,
  }: CreateAuthTokensCommand): Promise<CreateAuthTokensPayloadDto> {
    const tokens = await this.tokenRepository.save([accessToken, refreshToken]);

    return new CreateAuthTokensPayloadDto({
      accessToken: tokens[0],
      refreshToken: tokens[1],
    });
  }
}
