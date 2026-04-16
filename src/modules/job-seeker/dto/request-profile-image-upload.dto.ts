import { IsIn, IsString } from 'class-validator';

const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export class RequestProfileImageUploadDto {
  @IsString()
  fileName: string;

  @IsIn(ALLOWED_IMAGE_MIME_TYPES)
  mimeType: string;
}
