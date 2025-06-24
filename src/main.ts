import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  NestExpressApplication,
  ExpressAdapter,
} from '@nestjs/platform-express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { LoggerService } from './shared/services/logger.service';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { middleware as expressCtx } from 'express-ctx';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { QueryFailedFilter } from './filters/query-failed.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { rawBody: true },
  );

  app.set('trust proxy', true);

  const loggerService = app.select(SharedModule).get(LoggerService);

  app.useLogger(loggerService);
  app.use(
    morgan('combined', {
      stream: {
        write: (message) => {
          loggerService.log(message);
        },
      },
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: '*', // Update with your frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you need to allow cookies
  });

  app.use(compression());
  app.use(cookieParser());
  app.use(helmet());

  app.enableVersioning();
  app.setGlobalPrefix('api');

  const reflector = app.get(Reflector);

  app.useGlobalFilters(
    new HttpExceptionFilter(reflector),
    new QueryFailedFilter(reflector),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    new TransformInterceptor(reflector),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

  app.use(expressCtx);

  await app.listen(3000);
}
bootstrap();
