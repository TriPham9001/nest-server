import { Provider } from '../../../constants/token.constant';
import {
  ClassField,
  EmailField,
  EnumField,
  StringField,
} from 'src/decorators/field.decorator';

class UserDto {
  @StringField()
  firstName!: string;

  @StringField()
  lastName!: string;

  @EmailField()
  email!: string;

  @StringField()
  image!: string;

  @StringField()
  userName!: string;
}

export class VerifyRequestDto {
  @StringField()
  idToken!: string;

  @EnumField(() => Provider)
  provider!: Provider;

  @ClassField(() => UserDto)
  user!: UserDto;

  constructor(partial: Partial<VerifyRequestDto>) {
    Object.assign(this, partial);
  }
}
