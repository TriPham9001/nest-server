import { CreateTokenRequestDto } from '../dtos/create-token-request.dto';

export class CreateEmailVerificationTokenCommand {
  constructor(public readonly token: CreateTokenRequestDto) {}
}
