import './boilerplate.polyfill';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { SharedModule } from './shared/shared.module';
import { TerminusModule } from '@nestjs/terminus';
import { EventEmitterModule } from '@nestjs/event-emitter';
import {
  ConfigService,
  validationSchema,
} from './shared/services/config.service';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { FileModule } from './modules/file/file.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TokenModule } from './modules/token/token.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bull';
import { RoleModule } from './modules/role/role.module';
import { BlogModule } from './modules/blog/blog.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TerminusModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [SharedModule],
      useFactory: async (configService: ConfigService) =>
        configService.cacheManagerConfig,
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      validationSchema,
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => configService.typeOrmConfig,
      inject: [ConfigService],
      dataSourceFactory: (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return Promise.resolve(
          addTransactionalDataSource(new DataSource(options)),
        );
      },
    }),
    BullModule.forRootAsync({
      imports: [SharedModule],
      useFactory: async (configService: ConfigService) =>
        configService.bullConfig,
      inject: [ConfigService],
    }),
    FileModule,
    AuthModule,
    UserModule,
    TokenModule,
    RoleModule,
    BlogModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
