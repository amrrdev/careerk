import { OtpPurpose } from '../enums/otp-purpose.enum';
import { UserType } from '../enums/user-type.enum';

export interface OtpData {
  code: string;
  email: string;
  purpose: OtpPurpose;
  userType: UserType;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}
