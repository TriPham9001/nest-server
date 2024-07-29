import { Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from './config.service';

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient;
  private readonly s3: S3Client;

  constructor(public configService: ConfigService) {
    const supabaseS3Config = configService.supabaseConfig;

    this.supabase = createClient(supabaseS3Config.url, supabaseS3Config.key);

    this.s3 = new S3Client({
      region: supabaseS3Config.bucketRegion,
      endpoint: supabaseS3Config.bucketEndpoint,
    });
  }

  async getImageUrl(path: string): Promise<string | null> {
    const { data } = this.supabase.storage
      .from(this.configService.supabaseConfig.bucketName)
      .getPublicUrl(path);

    return data.publicUrl;
  }
}
