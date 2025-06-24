import { StringField } from 'src/decorators/field.decorator';

export class CreateBlogRequestDto {
  @StringField()
  readonly name!: string;

  @StringField()
  readonly description!: string;

  @StringField()
  readonly content!: string;

  @StringField()
  readonly slug!: string;
}
