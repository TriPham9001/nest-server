import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from 'src/shared/services/config.service';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from './token.entity';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';

@Module({
  imports: [
    CqrsModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.jwtConfig.jwtSecret,
      }),
    }),
    TypeOrmModule.forFeature([TokenEntity]),
  ],
  providers: [TokenService, ...CommandHandlers, ...QueryHandlers],
  exports: [TokenService],
})
export class TokenModule {}
