import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { type ConfigType } from '@nestjs/config';
import mediaStorageConfig from './config/media-storage.config';

@Injectable()
export class MediaStorageService {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly publicBaseUrl: string;

  constructor(
    @Inject(mediaStorageConfig.KEY)
    private readonly mediaStorageConfiguration: ConfigType<typeof mediaStorageConfig>,
  ) {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: this.mediaStorageConfiguration.endpoint,
      credentials: {
        accessKeyId: this.mediaStorageConfiguration.accessKeyId!,
        secretAccessKey: this.mediaStorageConfiguration.accessSecretKey!,
      },
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    });
    this.bucket = this.mediaStorageConfiguration.bucketName!;
    this.publicBaseUrl = this.mediaStorageConfiguration.publicBaseUrl?.replace(/\/+$/, '') || '';
  }

  buildJobSeekerProfileImageKey(jobSeekerId: string, fileName: string): string {
    return this.buildKey('profile-images', jobSeekerId, fileName);
  }

  buildCompanyLogoKey(companyId: string, fileName: string): string {
    return this.buildKey('company-logos', companyId, fileName);
  }

  async generateUploadUrl(key: string, mimeType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: mimeType,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  buildFileUrl(key: string): string {
    if (!this.publicBaseUrl) {
      throw new InternalServerErrorException('R2 media public base URL is not configured');
    }

    return `${this.publicBaseUrl}/${key}`;
  }

  extractKeyFromFileUrl(fileUrl: string): string | null {
    if (!this.publicBaseUrl) return null;

    const prefix = `${this.publicBaseUrl}/`;
    if (!fileUrl.startsWith(prefix)) return null;

    return decodeURIComponent(fileUrl.slice(prefix.length));
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

  private buildKey(prefix: string, ownerId: string, fileName: string): string {
    const safeFileName = this.sanitizeFileName(fileName);
    return `${prefix}/${ownerId}/${Date.now()}-${safeFileName}`;
  }

  private sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, '-');
  }
}
