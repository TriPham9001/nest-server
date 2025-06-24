import { StringFieldOptional } from 'src/decorators/field.decorator';

export class UpdateBlogRequestDto {
  @StringFieldOptional()
  name?: string;

  @StringFieldOptional()
  description?: string;

  @StringFieldOptional()
  content?: string;

  @StringFieldOptional()
  slug?: string;
  d;

  constructor(partial: Partial<UpdateBlogRequestDto>) {
    Object.assign(this, partial);
  }
}
