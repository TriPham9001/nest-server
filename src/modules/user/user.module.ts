import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './command/handlers';
import { QueryHandlers } from './queries/handlers';
import { BlogModule } from '../blog/blog.module';

@Module({
  controllers: [UserController],
  providers: [UserService, ...CommandHandlers, ...QueryHandlers],
  imports: [TypeOrmModule.forFeature([UserEntity]), CqrsModule, BlogModule],
  exports: [UserService],
})
export class UserModule {}
