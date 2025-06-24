import { AbstractDto } from 'src/common/dto/abstract.dto';
import { Provider, TokenType } from 'src/constants/token.constant';
import {
  BooleanFieldOptional,
  DateField,
  EnumField,
  StringField,
  UUIDField,
} from 'src/decorators/field.decorator';
import { TokenEntity } from '../token.entity';

export class TokenDto extends AbstractDto {
  @StringField()
  token!: string;

  @UUIDField()
  userId!: Uuid;

  @EnumField(() => TokenType)
  type!: TokenType;

  @EnumField(() => Provider)
  provider!: Provider;

  @BooleanFieldOptional()
  blacklisted?: boolean;

  @DateField()
  expiresAt!: Date;

  constructor(token: TokenEntity) {
    super(token);
    this.token = token.token;
    this.userId = token.userId;
    this.type = token.type;
    this.provider = token.provider;
    this.blacklisted = token.blacklisted;
    this.expiresAt = token.expiresAt;
  }
}
