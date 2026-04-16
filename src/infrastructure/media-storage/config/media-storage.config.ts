import { registerAs } from '@nestjs/config';

export default registerAs('media', () => ({
  endpoint: process.env.R2_MEDIA_ENDPOINT,
  accessKeyId: process.env.R2_MEDIA_ACCESS_KEY_ID,
  accessSecretKey: process.env.R2_MEDIA_SECRET_ACCESS_KEY,
  bucketName: process.env.R2_MEDIA_BUCKET_NAME,
  publicBaseUrl: process.env.R2_MEDIA_PUBLIC_BASE_URL,
}));
