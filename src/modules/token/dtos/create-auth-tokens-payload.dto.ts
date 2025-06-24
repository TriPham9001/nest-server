import { ClassField } from 'src/decorators/field.decorator';
import { TokenDto } from './token.dto';

export class CreateAuthTokensPayloadDto {
  @ClassField(() => TokenDto)
  accessToken!: TokenDto;

  @ClassField(() => TokenDto)
  refreshToken!: TokenDto;

  constructor(data: { accessToken: TokenDto; refreshToken: TokenDto }) {
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
  }
}
