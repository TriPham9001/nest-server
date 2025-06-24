import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CqrsModule } from '@nestjs/cqrs';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { RoleModule } from '../role/role.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    CqrsModule,
    TokenModule,
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule,
    RoleModule,
    FileModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
