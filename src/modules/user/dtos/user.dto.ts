import { AbstractDto } from 'src/common/dto/abstract.dto';
import {
  DateFieldOptional,
  StringField,
  UUIDFieldOptional,
  StringFieldOptional,
  BooleanFieldOptional,
} from 'src/decorators/field.decorator';
import { type UserEntity } from '../user.entity';
import { FileEntity } from 'src/modules/file/file.entity';
import { Type } from 'class-transformer';

export class UserDto extends AbstractDto {
  @StringField()
  email!: string;

  @StringField()
  firstName!: string;

  @StringField()
  lastName!: string;

  @StringField()
  userName!: string;

  @BooleanFieldOptional({ default: false })
  needPasswordChange?: boolean;

  @StringFieldOptional({ nullable: true })
  avatar?: string;

  @UUIDFieldOptional({ nullable: true })
  avatarId?: Uuid;

  @Type(() => FileEntity)
  avatarFile: FileEntity;

  @DateFieldOptional({ nullable: true })
  lastLoginAt?: Date;

  @DateFieldOptional({ nullable: true })
  dateOfBirth?: Date;

  constructor(user: UserEntity) {
    super(user);
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.needPasswordChange = user.needPasswordChange;
    this.lastLoginAt = user.lastLoginAt;
  }
}
