import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  Unique,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { AbstractEntity } from '../../common/abstract.entity';
import { UserDto } from './dtos/user.dto';
import { UseDto } from '../../decorators/use-dto.decorator';
import { RoleEntity } from '../role/role.entity';

@Entity({ name: 'users' })
@Unique(['email'])
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto> {
  @Column({ unique: true, type: 'varchar', nullable: false })
  email!: string;

  @Column({ type: 'varchar', nullable: false })
  firstName!: string;

  @Column({ type: 'varchar', nullable: false })
  lastName!: string;

  @Column({ type: 'varchar' })
  userName: string;

  @Column()
  description: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: false, select: false })
  password!: string;

  @Column({ type: 'boolean', default: false })
  needPasswordChange: boolean;

  @Column({ type: 'uuid' })
  roleId: Uuid;

  @OneToOne(() => RoleEntity)
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  lastLoginAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  updateNamedAt: Date | null;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  static async comparePasswords(
    candidatePassword: string,
    hashedPassword: string,
  ) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}
