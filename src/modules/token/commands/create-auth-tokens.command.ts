import { CreateAuthTokensRequestDto } from '../dtos/create-auth-tokens-request.dto';

export class CreateAuthTokensCommand {
  constructor(
    public readonly accessToken: CreateAuthTokensRequestDto,
    public readonly refreshToken: CreateAuthTokensRequestDto,
  ) {}
}
