import { IsString } from 'class-validator';

export class ConfirmCompanyImageUploadDto {
  @IsString()
  key: string;
}
