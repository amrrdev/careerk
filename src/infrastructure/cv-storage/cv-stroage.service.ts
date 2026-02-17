import { Inject, Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import cvStorageConfig from './config/cv-storage.config';
import { type ConfigType } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class CvStorageService {
  private s3Client: S3Client;
  private bucket: string;

  constructor(
    @Inject(cvStorageConfig.KEY)
    private readonly cvStroageConfiguration: ConfigType<typeof cvStorageConfig>,
  ) {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: this.cvStroageConfiguration.endpoint,
      credentials: {
        accessKeyId: this.cvStroageConfiguration.accessKeyId!,
        secretAccessKey: this.cvStroageConfiguration.accessSecretKey!,
      },
      requestChecksumCalculation: 'WHEN_REQUIRED', // ← only add checksum when explicitly needed
      responseChecksumValidation: 'WHEN_REQUIRED', // ← same for responses
    });
    this.bucket = this.cvStroageConfiguration.bucketName!;
  }

  buildKey(jobSeekerId: string, fileName: string): string {
    return `cvs/${jobSeekerId}/${Date.now()}-${fileName}`;
  }

  async generateUploadUrl(key: string, mimeType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: mimeType,
    });
    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  async generateDownloadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  async fileExists(key: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
      return true;
    } catch {
      return false;
    }
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3Client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }
}
