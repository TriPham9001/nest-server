import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { StringFieldOptional } from 'src/decorators/field.decorator';

export class UserPageOptionsDto extends PageOptionsDto {
  @StringFieldOptional({ nullable: true, default: null, minLength: 0 })
  keyword?: string | null;

  constructor(o: Partial<UserPageOptionsDto>) {
    super();
    Object.assign(this, o);
  }
}
