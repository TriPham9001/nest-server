import { AbstractEntity } from '../../common/abstract.entity';
import { Column, DeleteDateColumn, Entity } from 'typeorm';
import { BlogDto } from './dtos/blog.dto';
import { UseDto } from '../../decorators/use-dto.decorator';

@Entity('blogs')
@UseDto(BlogDto)
export class BlogEntity extends AbstractEntity<BlogDto> {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  content: string;

  @Column()
  slug: string;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date;
}
