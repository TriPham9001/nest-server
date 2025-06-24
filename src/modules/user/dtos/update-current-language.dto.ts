import { UUIDField } from '../../../decorators/field.decorator';

export class UpdateCurrentLanguageDto {
  @UUIDField()
  currentLanguageId?: Uuid;

  constructor(partial: Partial<UpdateCurrentLanguageDto>) {
    Object.assign(this, partial);
  }
}
