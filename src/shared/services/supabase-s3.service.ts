import { Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from './config.service';
import { GeneratorService } from './generator.service';
import mime from 'mime-types';

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient;
  private readonly s3: S3Client;

  constructor(
    public configService: ConfigService,
    public generatorService: GeneratorService,
  ) {
    const supabaseS3Config = configService.supabaseConfig;

    this.supabase = createClient(supabaseS3Config.url, supabaseS3Config.key);

    this.s3 = new S3Client({
      region: supabaseS3Config.bucketRegion,
      endpoint: supabaseS3Config.bucketEndpoint,
      credentials: {
        accessKeyId: supabaseS3Config.accessKeyId,
        secretAccessKey: supabaseS3Config.secretAccessKey,
      },
    });
  }

  async getImageUrl(path: string): Promise<string | null> {
    const { data } = this.supabase.storage
      .from(this.configService.supabaseConfig.bucketName)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async uploadImage(file: Express.Multer.File, path?: string) {
    const fileName = this.generatorService.fileName(
      <string>mime.extension(file.mimetype),
    );

    const filePath = path ? `${path}/${fileName}` : fileName;
    const key = path + '/' + fileName;
    // Upload the file to Supabase storage
    const { error } = await this.supabase.storage
      .from(this.configService.supabaseConfig.bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true, // Replace if the file already exists
      });

    // Handle potential upload errors
    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    return {
      key: filePath,
      url: `https://${this.configService.supabaseConfig.bucketName}.s3.supabase.com/${key}`, // Return the public URL
    };
  }

  async deleteFile(path: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(this.configService.supabaseConfig.bucketName)
      .remove([path]);

    if (error) {
      throw new Error(`Deletion failed: ${error.message}`);
    }
  }
}
