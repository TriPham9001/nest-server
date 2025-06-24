import { CreateAuthTokensHandler } from './create-auth-tokens.handler';
import { CreateEmailVerificationTokenHandler } from './create-email-verification-token.handler';

export const CommandHandlers = [
  CreateAuthTokensHandler,
  CreateEmailVerificationTokenHandler,
];
