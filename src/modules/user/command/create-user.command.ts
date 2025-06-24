import { Provider } from '../../../constants/token.constant';
import { RegisterRequestDto } from 'src/modules/auth/dtos/register-request';

export class CreateUserCommand {
  constructor(
    public readonly registerDto: RegisterRequestDto,
    public readonly provider: Provider = Provider.LOCAL,
  ) {}
}
