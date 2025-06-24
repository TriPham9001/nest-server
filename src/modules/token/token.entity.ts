import { AbstractEntity } from 'src/common/abstract.entity';
import { Provider, TokenType } from 'src/constants/token.constant';
import { UseDto } from 'src/decorators/use-dto.decorator';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { TokenDto } from './dtos/token.dto';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'tokens' })
@UseDto(TokenDto)
export class TokenEntity extends AbstractEntity<TokenDto> {
  @Column({ type: 'varchar', length: 255, nullable: false })
  token: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @Column({ type: 'uuid' })
  userId!: Uuid;

  @Column({ type: 'enum', enum: TokenType, default: TokenType.ACCESS })
  type: TokenType;

  @Column({ type: 'enum', enum: Provider, default: Provider.LOCAL })
  provider: Provider;

  @Column({ type: 'boolean', default: false })
  blacklisted: boolean;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date;
}
