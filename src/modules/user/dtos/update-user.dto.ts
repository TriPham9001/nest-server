import {
  DateFieldOptional,
  StringFieldOptional,
} from '../../../decorators/field.decorator';

export class UpdateUserDto {
  @StringFieldOptional()
  firstName?: string;

  @StringFieldOptional()
  lastName?: string;

  @StringFieldOptional()
  userName?: string;

  @StringFieldOptional()
  description?: string;

  @DateFieldOptional()
  dateOfBirth?: Date;

  constructor(partial: Partial<UpdateUserDto>) {
    Object.assign(this, partial);
  }
}
