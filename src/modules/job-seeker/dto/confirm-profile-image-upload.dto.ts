import { IsString } from 'class-validator';

export class ConfirmProfileImageUploadDto {
  @IsString()
  key: string;
}
