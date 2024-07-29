import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './shared/services/config.service';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.getNumber('PORT') || 3000;

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
