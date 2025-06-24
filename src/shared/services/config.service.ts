import { type TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import Joi from 'joi';
import { IAppOptions } from 'src/interfaces/app.interface';
import { ISwaggerConfigOptions } from 'src/interfaces/swagger-config.interface';
import { SeederOptions } from 'typeorm-extension';
import winston from 'winston';
import { Injectable } from '@nestjs/common';
import { IJWTConfigOptions } from 'src/interfaces/jwt-config.interface';
import { type BullRootModuleOptions } from '@nestjs/bull';
import { CacheModuleOptions } from '@nestjs/cache-manager';
import redisStore from 'cache-manager-redis-store';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
});

@Injectable()
export class ConfigService {
  constructor() {
    dotenv.config({
      path: `.env`,
    });

    // Replace \\n with \n to support multiline strings in AWS
    for (const envName of Object.keys(process.env)) {
      process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
    }
  }

  public get(key: string): string {
    return process.env[key];
  }

  public getNumber(key: string): number {
    return Number(this.get(key));
  }

  get nodeEnv(): string {
    return this.get('NODE_ENV') || 'development';
  }

  get appConfig(): IAppOptions {
    return {
      name: this.get('APP_NAME'),
      url: this.get('APP_URL'),
    };
  }

  get typeOrmConfig(): TypeOrmModuleOptions & SeederOptions {
    const entities = [__dirname + '/../../modules/**/*.entity{.ts,.js}'];
    const migrations = [__dirname + '/../../database/migrations/*{.ts,.js}'];
    const seeds = [__dirname + '/../../database/seeds/*{.ts,.js}'];

    return {
      entities,
      migrations,
      seeds,
      migrationsTableName: 'migrations',
      migrationsRun: true,
      keepConnectionAlive: true,
      synchronize: false,
      type: 'postgres',
      host: this.get('DATABASE_HOST'),
      port: this.getNumber('DATABASE_PORT'),
      username: this.get('DATABASE_USER'),
      password: this.get('DATABASE_PASSWORD'),
      database: this.get('DATABASE_DATABASE'),
      logging: this.nodeEnv !== 'production',
      ssl: this.nodeEnv === 'production',
      autoLoadEntities: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    };
  }

  get jwtConfig(): IJWTConfigOptions {
    return {
      googleClientId: this.get('GOOGLE_CLIENT_ID'),
      googleClientSecret: this.get('GOOGLE_CLIENT_SECRET'),
      jwtAccessExpirationMinutes:
        this.getNumber('JWT_ACCESS_EXPIRATION_MINUTES') || 30,
      jwtRefreshExpirationDays:
        this.getNumber('JWT_REFRESH_EXPIRATION_DAYS') || 30,
      jwtSecret: this.get('JWT_SECRET'),
      jwtVerifyEmailExpirationMinutes:
        this.getNumber('JWT_VERIFY_EMAIL_EXPIRATION_MINUTES') || 30,
      jwtWorkspaceInvitationExpirationDays:
        this.getNumber('JWT_WORKSPACE_INVITATION_EXPIRATION_DAYS') || 30,
      allowedEmails: this.get('ALLOWED_EMAILS').split(',') || [],
    };
  }

  get bullConfig(): BullRootModuleOptions {
    return {
      redis: {
        host: this.get('REDIS_HOST'),
        port: this.getNumber('REDIS_PORT'),
        password: this.get('REDIS_PASSWORD'),
      },
    };
  }

  get supabaseConfig(): any {
    return {
      url: this.get('SUPABASE_URL'),
      key: this.get('SUPABASE_ANON_KEY'),
      bucketEndpoint: this.get('S3_ENDPOINT'),
      bucketName: this.get('SUPABASE_S3_BUCKET_NAME'),
      bucketRegion: this.get('SUPABASA_S3_BUCKET_REGION'),
      accessKeyId: this.get('SUPABASE_S3_ACCESS_KEY_ID'),
      secretAccessKey: this.get('SUPABASE_S3_SECRET_ACCESS_KEY'),
    };
  }

  get winstonConfig(): winston.LoggerOptions {
    return {
      transports: [
        new winston.transports.Console({
          level: 'debug',
          handleExceptions: true,
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({
              format: 'DD-MM-YYYY HH:mm:ss',
            }),
            winston.format.simple(),
          ),
        }),
      ],
      exitOnError: false,
    };
  }

  get swaggerConfig(): ISwaggerConfigOptions {
    return {
      path: this.get('SWAGGER_PATH') || '/api/docs',
      title: this.get('SWAGGER_TITLE') || 'Demo Microservice API',
      description: this.get('SWAGGER_DESCRIPTION'),
      version: this.get('SWAGGER_VERSION') || '0.0.1',
      scheme: this.get('SWAGGER_SCHEME') === 'https' ? 'https' : 'http',
    };
  }

  get cacheManagerConfig(): CacheModuleOptions {
    return {
      store: redisStore,
      host: this.get('REDIS_HOST'),
      port: this.getNumber('REDIS_PORT'),
      password: this.get('REDIS_PASSWORD'),
      ttl: 604800,
    };
  }
}
