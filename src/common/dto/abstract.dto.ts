import { DateField, UUIDField } from 'src/decorators/field.decorator';
import { AbstractEntity } from '../abstract.entity';

export class AbstractDto {
  @UUIDField()
  id!: Uuid;

  @DateField()
  created_at!: Date;

  @DateField()
  updated_at!: Date;

  constructor(entity: AbstractEntity, options?: { excludeFields?: boolean }) {
    if (!options?.excludeFields) {
      this.id = entity.id;
      this.created_at = entity.created_at;
      this.updated_at = entity.updated_at;
    }
  }
}
