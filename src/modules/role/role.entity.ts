import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'roles' })
export class RoleEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  description: string;
}
