import { IsIn, IsString } from 'class-validator';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export class RequestUploadUrlDto {
  @IsString()
  fileName: string;

  @IsIn(ALLOWED_MIME_TYPES)
  mimeType: string;
}
