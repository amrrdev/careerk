import { OtpPurpose } from '../enums/otp-purpose.enum';

export interface OtpData {
  code: string;
  email: string;
  purpose: OtpPurpose;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}
