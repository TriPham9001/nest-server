import { Provider, TokenType } from 'src/constants/token.constant';
import {
  DateField,
  EnumField,
  StringField,
  UUIDField,
} from 'src/decorators/field.decorator';

export class CreateTokenRequestDto {
  @EnumField(() => Provider)
  provider: Provider;

  @EnumField(() => TokenType)
  type: TokenType;

  @UUIDField()
  userId: Uuid;

  @StringField()
  token!: string;

  @DateField()
  expiresAt: Date;

  constructor(data: {
    provider: Provider;
    type: TokenType;
    userId: Uuid;
    token: string;
    expiresAt: Date;
  }) {
    this.provider = data.provider;
    this.type = data.type;
    this.userId = data.userId;
    this.token = data.token;
    this.expiresAt = data.expiresAt;
  }
}
