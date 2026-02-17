import { IsString } from 'class-validator';

export class ConfirmUploadDto {
  @IsString()
  key: string;

  @IsString()
  fileName: string;

  @IsString()
  mimeType: string;
}
