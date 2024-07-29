import { Global, Module, type Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { GeneratorService } from './services/generator.service';
import { ConfigService } from './services/config.service';
import { LoggerService } from './services/logger.service';
import { SupabaseService } from './services/supabase-s3.service';

const providers: Provider[] = [
  SupabaseService,
  ConfigService,
  LoggerService,
  GeneratorService,
];

@Global()
@Module({
  providers,
  imports: [CqrsModule],
  exports: [...providers, CqrsModule],
})
export class SharedModule {}
