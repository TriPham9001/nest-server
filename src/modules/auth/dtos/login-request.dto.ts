import { EmailField, PasswordField } from 'src/decorators/field.decorator';

export class LoginRequestDto {
  @EmailField()
  readonly email!: string;

  @PasswordField()
  readonly password!: string;
}
