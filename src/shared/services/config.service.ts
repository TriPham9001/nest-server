import { Injectable } from '@nestjs/common';
import dotenv from 'dotenv';
import Joi from 'joi';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { IAppOptions } from 'src/interfaces/app.interface';
import { ISwaggerConfigOptions } from 'src/interfaces/swagger-config.interface';
import { SeederOptions } from 'typeorm-extension';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
});

@Injectable()
export class ConfigService {
  constructor() {
    dotenv.config({ path: `.env` });

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
    const entities = ['dist/modules/**/*.entity{.ts,.js}'];

    return {
      entities,
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

  get supabaseConfig(): any {
    return {
      url: this.get('SUPABASE_URL'),
      key: this.get('SUPABASE_ANON_KEY'),
      bucketName: this.get('SUPABASE_BUCKET_NAME'),
      bucketRegion: this.get('S3_REGION'),
      bucketEndpoint: this.get('S3_ENDPOINT'),
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
}
