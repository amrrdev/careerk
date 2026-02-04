import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/infrastructure/redis/redis.service';
import { OtpPurpose } from '../enums/otp-purpose.enum';
import * as crypto from 'crypto';
import { OtpData } from '../interfaces/otp-data.interface';
import { UserType } from '../enums/user-type.enum';

@Injectable()
export class OtpService {
  private readonly OTP_LENGTH = 6;
  private readonly OTP_EXPIRY_MINUTES = 10;
  private readonly MAX_ATTEMPTS = 3;

  constructor(private readonly redisService: RedisService) {}

  async createOtp(email: string, purpose: OtpPurpose, userType: UserType) {
    const code = this.generateOtpCode();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

    const otpData: OtpData = {
      code,
      email: email.toLowerCase(),
      purpose,
      userType,
      expiresAt,
      attempts: 0,
      createdAt: now,
    };

    const key = this.getKey(email, purpose);
    const ttl = this.OTP_EXPIRY_MINUTES * 60;

    await this.redisService.set(key, JSON.stringify(otpData), ttl);
    return code;
  }

  async verifyOtp(email: string, code: string, purpose: OtpPurpose): Promise<OtpData | null> {
    const key = this.getKey(email, purpose);
    const data = await this.redisService.get(key);
    if (!data) {
      return null;
    }

    const otpData = JSON.parse(data) as OtpData;
    otpData.expiresAt = new Date(otpData.expiresAt);
    otpData.createdAt = new Date(otpData.createdAt);

    if (new Date() > otpData.expiresAt) {
      await this.redisService.del(key);
      return null;
    }

    if (otpData.attempts >= this.MAX_ATTEMPTS) {
      await this.redisService.del(key);
      return null;
    }

    if (otpData.code !== code) {
      otpData.attempts += 1;
      const remainingTtl = Math.floor((otpData.expiresAt.getTime() - Date.now()) / 1000);
      await this.redisService.set(key, JSON.stringify(otpData), remainingTtl);
      return null;
    }

    await this.redisService.del(key);
    return otpData;
  }

  private getKey(email: string, purpose: OtpPurpose) {
    return `otp:${purpose}:${email.toLowerCase()}`;
  }

  private generateOtpCode(): string {
    return crypto.randomInt(0, 1e6).toString().padStart(6, '0');
  }
}
