import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, DeleteDateColumn, Entity } from 'typeorm';

@Entity({ name: 'files' })
export class FileEntity extends AbstractEntity {
  @Column()
  url: string;

  @Column()
  fileName: string;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date;
}
