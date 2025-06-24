import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './role.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryHandlers } from './queries/handlers';

@Module({
  providers: [RoleService, ...QueryHandlers],
  controllers: [RoleController],
  imports: [TypeOrmModule.forFeature([RoleEntity]), CqrsModule],
  exports: [RoleService],
})
export class RoleModule {}
