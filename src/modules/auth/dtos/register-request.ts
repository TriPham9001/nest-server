import {
  DateField,
  EmailField,
  PasswordField,
  StringField,
  StringFieldOptional,
  UUIDFieldOptional,
} from 'src/decorators/field.decorator';

export class RegisterRequestDto {
  @EmailField()
  readonly email!: string;

  @PasswordField()
  readonly password!: string;

  @StringField()
  readonly firstName!: string;

  @StringField()
  readonly lastName!: string;

  @StringField()
  readonly userName!: string;

  @DateField()
  readonly dateOfBirth!: Date;

  @StringFieldOptional()
  readonly image?: string;

  @UUIDFieldOptional()
  roleId?: Uuid;

  constructor(partial: Partial<RegisterRequestDto>) {
    Object.assign(this, partial);
  }
}
