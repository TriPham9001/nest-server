import { CreateAuthTokensRequestDto } from '../dtos/create-auth-tokens-request.dto';

export class CreateTokenCommand {
  constructor(public readonly token: CreateAuthTokensRequestDto) {}
}
