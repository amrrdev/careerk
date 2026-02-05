import { Inject, Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import emailConfig from './config/email.config';
import type { ConfigType } from '@nestjs/config';
import { SendEmailOptions } from './interfaces/email-options.interface';
import { EmailTemplatesService } from './email-templates.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    @Inject(emailConfig.KEY) private readonly emailConfiguration: ConfigType<typeof emailConfig>,
    private readonly emailTemplatesService: EmailTemplatesService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.emailConfiguration.host,
      port: this.emailConfiguration.port,
      secure: this.emailConfiguration.secure,
      auth: {
        user: this.emailConfiguration.user,
        pass: this.emailConfiguration.pass,
      },
    });
  }

  async sendEmail(options: SendEmailOptions) {
    try {
      await this.transporter.sendMail({
        to: options.to,
        from: this.emailConfiguration.user,
        subject: options.subject,
        text: options.text,
        html: options.html,
        cc: options.cc,
        attachments: options.attachments,
      });
      this.logger.log('Email send successfully');
    } catch (error) {
      this.logger.error('Failed to send email', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(
    to: string,
    otp: string,
    userName?: string,
    expiryMinutes: number = 10,
  ) {
    const html = this.emailTemplatesService.getPasswordResetTemplate(otp, userName, expiryMinutes);

    return this.sendEmail({
      to,
      subject: 'Reset Your Password - CareerK',
      html,
    });
  }

  async sendVerificationEmail(
    to: string,
    otp: string,
    userName?: string,
    expiryMinutes: number = 10,
  ) {
    const html = this.emailTemplatesService.getEmailVerificationTemplate(
      otp,
      userName,
      expiryMinutes,
    );

    return this.sendEmail({
      to,
      subject: 'Verify Your Email - CareerK',
      html,
    });
  }
}
