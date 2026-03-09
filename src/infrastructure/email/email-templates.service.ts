import { Injectable } from '@nestjs/common';
import { ApplicationStatusEnum } from 'generated/prisma/client';
import {
  DirectMatchingCompletedEmailOptions,
  ScrapedMatchingCompletedEmailOptions,
} from './interfaces/matching-email-options.interface';

@Injectable()
export class EmailTemplatesService {
  getEmailVerificationTemplate(otp: string, userName?: string, expiryMinutes: number = 10): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f5f7fa;
        }

        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background-color: #f5f7fa;
            padding: 40px 20px;
        }

        .email-container {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .email-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
        }

        .logo {
            font-size: 32px;
            font-weight: 700;
            color: white;
            margin-bottom: 10px;
            letter-spacing: -0.5px;
        }

        .header-subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            font-weight: 400;
        }

        .email-body {
            padding: 50px 40px;
        }

        .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 20px;
        }

        .message {
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 30px;
            line-height: 1.8;
        }

        .otp-container {
            background: linear-gradient(135deg, #f6f8fb 0%, #f1f4f9 100%);
            border: 2px dashed #cbd5e0;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 35px 0;
        }

        .otp-label {
            font-size: 14px;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
            margin-bottom: 15px;
        }

        .otp-code {
            font-size: 48px;
            font-weight: 700;
            color: #667eea;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            text-align: center;
            margin: 10px 0;
        }

        .otp-hint {
            font-size: 13px;
            color: #a0aec0;
            margin-top: 15px;
        }

        .expiry-notice {
            background: #fff5f5;
            border-left: 4px solid #fc8181;
            padding: 16px 20px;
            border-radius: 8px;
            margin: 25px 0;
        }

        .expiry-notice p {
            font-size: 14px;
            color: #742a2a;
            margin: 0;
        }

        .expiry-notice strong {
            color: #c53030;
        }

        .footer-message {
            font-size: 14px;
            color: #718096;
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid #e2e8f0;
        }

        .email-footer {
            padding: 30px 40px;
            background-color: #f7fafc;
            text-align: center;
            font-size: 13px;
            color: #a0aec0;
        }

        .email-footer a {
            color: #667eea;
            text-decoration: none;
        }

        .social-links {
            margin: 20px 0;
        }

        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #a0aec0;
            text-decoration: none;
            font-size: 12px;
        }

        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #e2e8f0, transparent);
            margin: 20px 0;
        }

        @media only screen and (max-width: 600px) {
            .email-wrapper {
                padding: 20px 10px;
            }

            .email-body {
                padding: 35px 25px;
            }

            .greeting {
                font-size: 20px;
            }

            .otp-code {
                font-size: 36px;
                letter-spacing: 4px;
            }

            .email-footer {
                padding: 25px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <!-- Header -->
            <div class="email-header">
                <div class="logo">CareerK</div>
                <div class="header-subtitle">Your Career Journey Starts Here</div>
            </div>

            <!-- Body -->
            <div class="email-body">
                <div class="greeting">
                    ${userName ? `Hi ${userName}! 👋` : 'Hello there! 👋'}
                </div>

                <div class="message">
                    Thanks for signing up! We're excited to have you on board. To complete your registration and verify your email address, please use the verification code below:
                </div>

                <!-- OTP Container -->
                <div class="otp-container">
                    <div class="otp-label">Verification Code</div>
                    <div class="otp-code">${otp}</div>
                    <div class="otp-hint">Enter this code in the verification page</div>
                </div>

                <!-- Expiry Notice -->
                <div class="expiry-notice">
                    <p>⏰ This code will expire in <strong>${expiryMinutes} minutes</strong>. Please verify your email before it expires.</p>
                </div>

                <div class="message">
                    If you didn't create an account with CareerK, you can safely ignore this email.
                </div>

                <div class="footer-message">
                    <strong>Need help?</strong><br>
                    If you're having trouble verifying your email, please contact our support team.
                </div>
            </div>

            <!-- Footer -->
            <div class="email-footer">
                <div class="divider"></div>

                <p>© ${new Date().getFullYear()} CareerK. All rights reserved.</p>

                <div class="social-links">
                    <a href="#">Privacy Policy</a> •
                    <a href="#">Terms of Service</a> •
                    <a href="#">Contact Support</a>
                </div>

                <p style="margin-top: 15px; font-size: 12px;">
                    This is an automated email, please do not reply to this message.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  getPasswordResetTemplate(otp: string, userName?: string, expiryMinutes: number = 10): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f5f7fa;
        }

        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background-color: #f5f7fa;
            padding: 40px 20px;
        }

        .email-container {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .email-header {
            background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%);
            padding: 40px 30px;
            text-align: center;
        }

        .logo {
            font-size: 32px;
            font-weight: 700;
            color: white;
            margin-bottom: 10px;
            letter-spacing: -0.5px;
        }

        .header-subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            font-weight: 400;
        }

        .email-body {
            padding: 50px 40px;
        }

        .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 20px;
        }

        .message {
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 30px;
            line-height: 1.8;
        }

        .otp-container {
            background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
            border: 2px dashed #f59e0b;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 35px 0;
        }

        .otp-label {
            font-size: 14px;
            color: #92400e;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
            margin-bottom: 15px;
        }

        .otp-code {
            font-size: 48px;
            font-weight: 700;
            color: #dc2626;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            text-align: center;
            margin: 10px 0;
        }

        .otp-hint {
            font-size: 13px;
            color: #92400e;
            margin-top: 15px;
        }

        .security-notice {
            background: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
        }

        .security-notice-title {
            font-size: 16px;
            font-weight: 600;
            color: #991b1b;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        }

        .security-notice-title::before {
            content: '🔒';
            margin-right: 8px;
            font-size: 20px;
        }

        .security-notice p {
            font-size: 14px;
            color: #7f1d1d;
            margin: 8px 0;
            line-height: 1.6;
        }

        .expiry-notice {
            background: #fff5f5;
            border-left: 4px solid #fc8181;
            padding: 16px 20px;
            border-radius: 8px;
            margin: 25px 0;
        }

        .expiry-notice p {
            font-size: 14px;
            color: #742a2a;
            margin: 0;
        }

        .expiry-notice strong {
            color: #c53030;
        }

        .warning-box {
            background: #fffbeb;
            border: 2px solid #fbbf24;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }

        .warning-box p {
            font-size: 14px;
            color: #78350f;
            margin: 0;
            line-height: 1.6;
        }

        .warning-box strong {
            color: #92400e;
            display: block;
            margin-bottom: 8px;
        }

        .footer-message {
            font-size: 14px;
            color: #718096;
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid #e2e8f0;
        }

        .email-footer {
            padding: 30px 40px;
            background-color: #f7fafc;
            text-align: center;
            font-size: 13px;
            color: #a0aec0;
        }

        .email-footer a {
            color: #667eea;
            text-decoration: none;
        }

        .social-links {
            margin: 20px 0;
        }

        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #a0aec0;
            text-decoration: none;
            font-size: 12px;
        }

        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #e2e8f0, transparent);
            margin: 20px 0;
        }

        @media only screen and (max-width: 600px) {
            .email-wrapper {
                padding: 20px 10px;
            }

            .email-body {
                padding: 35px 25px;
            }

            .greeting {
                font-size: 20px;
            }

            .otp-code {
                font-size: 36px;
                letter-spacing: 4px;
            }

            .email-footer {
                padding: 25px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <!-- Header -->
            <div class="email-header">
                <div class="logo">CareerK</div>
                <div class="header-subtitle">Password Reset Request</div>
            </div>

            <!-- Body -->
            <div class="email-body">
                <div class="greeting">
                    ${userName ? `Hi ${userName}! 👋` : 'Hello there! 👋'}
                </div>

                <div class="message">
                    We received a request to reset the password for your CareerK account. To proceed with resetting your password, please use the verification code below:
                </div>

                <!-- OTP Container -->
                <div class="otp-container">
                    <div class="otp-label">Password Reset Code</div>
                    <div class="otp-code">${otp}</div>
                    <div class="otp-hint">Enter this code in the password reset page</div>
                </div>

                <!-- Expiry Notice -->
                <div class="expiry-notice">
                    <p>⏰ This code will expire in <strong>${expiryMinutes} minutes</strong>. Please complete your password reset before it expires.</p>
                </div>

                <!-- Security Notice -->
                <div class="security-notice">
                    <div class="security-notice-title">Security Information</div>
                    <p><strong>Important:</strong> For your security, all active sessions will be logged out once you reset your password. You'll need to log in again with your new password.</p>
                    <p>If you didn't request a password reset, please ignore this email and ensure your account is secure. Your password will remain unchanged.</p>
                </div>

                <!-- Warning Box -->
                <div class="warning-box">
                    <strong>⚠️ Didn't request this?</strong>
                    <p>If you did not request a password reset, someone may be trying to access your account. Please secure your account immediately and contact our support team.</p>
                </div>

                <div class="footer-message">
                    <strong>Need help?</strong><br>
                    If you're having trouble resetting your password or have security concerns, please contact our support team immediately.
                </div>
            </div>

            <!-- Footer -->
            <div class="email-footer">
                <div class="divider"></div>

                <p>© ${new Date().getFullYear()} CareerK. All rights reserved.</p>

                <div class="social-links">
                    <a href="#">Privacy Policy</a> •
                    <a href="#">Terms of Service</a> •
                    <a href="#">Contact Support</a>
                </div>

                <p style="margin-top: 15px; font-size: 12px;">
                    This is an automated email, please do not reply to this message.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  getApplicationStatusUpdateTemplate(params: {
    status: ApplicationStatusEnum;
    userName?: string;
    companyName?: string;
  }): string {
    const { status, userName, companyName } = params;
    const safeUserName = userName ? this.escapeHtml(userName) : 'there';
    const safeCompanyName = companyName ? this.escapeHtml(companyName) : 'a company';
    const statusLabel = this.formatApplicationStatus(status);
    const theme = this.getApplicationStatusTheme(status);
    const statusMessage = this.getApplicationStatusMessage(status);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Status Updated</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background-color: #f3f4f6;
        }

        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .email-container {
            background: #ffffff;
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
        }

        .email-header {
            background: linear-gradient(135deg, ${theme.headerStart} 0%, ${theme.headerEnd} 100%);
            padding: 36px 30px;
            text-align: center;
        }

        .logo {
            font-size: 30px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 8px;
            letter-spacing: -0.4px;
        }

        .header-subtitle {
            color: rgba(255, 255, 255, 0.92);
            font-size: 15px;
        }

        .email-body {
            padding: 42px 36px;
        }

        .greeting {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 18px;
        }

        .message {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 24px;
        }

        .status-card {
            background: ${theme.surface};
            border: 1px solid ${theme.border};
            border-radius: 14px;
            padding: 24px;
            margin: 30px 0;
        }

        .status-label {
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: #6b7280;
            margin-bottom: 14px;
        }

        .status-badge {
            display: inline-block;
            padding: 10px 18px;
            border-radius: 999px;
            background: ${theme.badgeBackground};
            color: ${theme.badgeText};
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 16px;
        }

        .status-description {
            font-size: 15px;
            color: #374151;
            line-height: 1.7;
        }

        .next-step {
            background: #f9fafb;
            border-left: 4px solid ${theme.headerEnd};
            border-radius: 10px;
            padding: 18px 20px;
            margin: 28px 0;
        }

        .next-step-title {
            font-size: 14px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 8px;
        }

        .next-step p {
            font-size: 14px;
            color: #4b5563;
        }

        .footer-message {
            font-size: 14px;
            color: #6b7280;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e5e7eb;
        }

        .email-footer {
            padding: 28px 36px;
            background: #f9fafb;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
        }

        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #d1d5db, transparent);
            margin: 18px 0;
        }

        @media only screen and (max-width: 600px) {
            .email-wrapper {
                padding: 20px 10px;
            }

            .email-body {
                padding: 32px 24px;
            }

            .greeting {
                font-size: 21px;
            }

            .email-footer {
                padding: 22px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <div class="email-header">
                <div class="logo">CareerK</div>
                <div class="header-subtitle">Application status update</div>
            </div>

            <div class="email-body">
                <div class="greeting">Hi ${safeUserName},</div>

                <div class="message">
                    ${safeCompanyName} has updated the status of your application on CareerK.
                </div>

                <div class="status-card">
                    <div class="status-label">Current status</div>
                    <div class="status-badge">${statusLabel}</div>
                    <div class="status-description">
                        ${statusMessage}
                    </div>
                </div>

                <div class="next-step">
                    <div class="next-step-title">Next step</div>
                    <p>Open your CareerK account to review the latest application details and continue any required follow-up.</p>
                </div>

                <div class="footer-message">
                    This email was sent because application status notifications are enabled for your account.
                </div>
            </div>

            <div class="email-footer">
                <div class="divider"></div>
                <p>&copy; ${new Date().getFullYear()} CareerK. All rights reserved.</p>
                <p style="margin-top: 12px;">This is an automated email. Please do not reply to this message.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  getDirectMatchingCompletedTemplate(params: DirectMatchingCompletedEmailOptions): string {
    const safeCompanyName = this.escapeHtml(params.companyName);
    const safeJobTitle = this.escapeHtml(params.jobTitle);
    const finishedAt = this.formatDateTime(params.finishedAt);
    const matchedCandidatesLabel =
      params.matchedCandidates === 1
        ? '1 matched candidate'
        : `${params.matchedCandidates} matched candidates`;
    const processedCandidatesLabel =
      params.processedCandidates === 1 ? '1 profile' : `${params.processedCandidates} profiles`;
    const summary =
      params.matchedCandidates > 0
        ? `Matching has completed for ${safeJobTitle}. We identified ${matchedCandidatesLabel} after evaluating ${processedCandidatesLabel}.`
        : `Matching has completed for ${safeJobTitle}. We evaluated ${processedCandidatesLabel}, but no candidates were matched in this run.`;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Direct Job Matching Completed</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f3f4f6; }
        .email-wrapper { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .email-container { background: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); }
        .email-header { background: linear-gradient(135deg, #0f766e 0%, #2563eb 100%); padding: 36px 30px; text-align: center; }
        .logo { font-size: 30px; font-weight: 700; color: #ffffff; margin-bottom: 8px; }
        .header-subtitle { color: rgba(255, 255, 255, 0.92); font-size: 15px; }
        .email-body { padding: 42px 36px; }
        .greeting { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 18px; }
        .message { font-size: 16px; color: #4b5563; margin-bottom: 24px; }
        .summary-card { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 14px; padding: 24px; margin: 30px 0; }
        .summary-label { font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #6b7280; margin-bottom: 14px; }
        .summary-title { font-size: 22px; font-weight: 700; color: #111827; margin-bottom: 12px; }
        .summary-text { font-size: 15px; color: #374151; }
        .meta { background: #f9fafb; border-left: 4px solid #2563eb; border-radius: 10px; padding: 18px 20px; margin: 28px 0; }
        .meta p { font-size: 14px; color: #4b5563; margin: 6px 0; }
        .footer-message { font-size: 14px; color: #6b7280; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
        .email-footer { padding: 28px 36px; background: #f9fafb; text-align: center; font-size: 12px; color: #9ca3af; }
        .divider { height: 1px; background: linear-gradient(to right, transparent, #d1d5db, transparent); margin: 18px 0; }
        @media only screen and (max-width: 600px) {
            .email-wrapper { padding: 20px 10px; }
            .email-body { padding: 32px 24px; }
            .greeting { font-size: 21px; }
            .email-footer { padding: 22px 20px; }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <div class="email-header">
                <div class="logo">CareerK</div>
                <div class="header-subtitle">Direct job matching completed</div>
            </div>

            <div class="email-body">
                <div class="greeting">Hi ${safeCompanyName},</div>

                <div class="message">
                    The candidate matching run for your published job has finished.
                </div>

                <div class="summary-card">
                    <div class="summary-label">Job</div>
                    <div class="summary-title">${safeJobTitle}</div>
                    <div class="summary-text">${summary}</div>
                </div>

                <div class="meta">
                    <p><strong>Processed at:</strong> ${finishedAt}</p>
                    <p><strong>Request ID:</strong> ${this.escapeHtml(params.requestId)}</p>
                </div>

                <div class="footer-message">
                    Open CareerK to review the matched candidates for this role.
                </div>
            </div>

            <div class="email-footer">
                <div class="divider"></div>
                <p>&copy; ${new Date().getFullYear()} CareerK. All rights reserved.</p>
                <p style="margin-top: 12px;">This is an automated email. Please do not reply to this message.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  getScrapedMatchingCompletedTemplate(params: ScrapedMatchingCompletedEmailOptions): string {
    const safeUserName = this.escapeHtml(params.firstName);
    const windowLabel = `${this.formatDateTime(params.since)} to ${this.formatDateTime(params.until)}`;
    const matchItems = params.topMatches
      .map((match) => {
        const scoreLabel = `${Math.round(match.matchScore)}% match`;
        const location = match.location ? ` - ${this.escapeHtml(match.location)}` : '';

        return `
          <li style="margin-bottom: 14px;">
              <strong>${this.escapeHtml(match.title)}</strong><br>
              <span>${this.escapeHtml(match.companyName)}${location}</span><br>
              <span style="color: #1d4ed8; font-weight: 700;">${scoreLabel}</span>
          </li>
        `;
      })
      .join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Job Matches</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f3f4f6; }
        .email-wrapper { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .email-container { background: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); }
        .email-header { background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); padding: 36px 30px; text-align: center; }
        .logo { font-size: 30px; font-weight: 700; color: #ffffff; margin-bottom: 8px; }
        .header-subtitle { color: rgba(255, 255, 255, 0.92); font-size: 15px; }
        .email-body { padding: 42px 36px; }
        .greeting { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 18px; }
        .message { font-size: 16px; color: #4b5563; margin-bottom: 24px; }
        .count-card { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 14px; padding: 24px; margin: 30px 0; text-align: center; }
        .count-number { font-size: 38px; font-weight: 700; color: #1d4ed8; margin-bottom: 10px; }
        .count-text { font-size: 15px; color: #374151; }
        .matches-card { background: #f9fafb; border-radius: 14px; padding: 24px; margin: 28px 0; }
        .matches-title { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 16px; }
        .meta { font-size: 14px; color: #6b7280; margin-top: 18px; }
        .footer-message { font-size: 14px; color: #6b7280; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
        .email-footer { padding: 28px 36px; background: #f9fafb; text-align: center; font-size: 12px; color: #9ca3af; }
        .divider { height: 1px; background: linear-gradient(to right, transparent, #d1d5db, transparent); margin: 18px 0; }
        @media only screen and (max-width: 600px) {
            .email-wrapper { padding: 20px 10px; }
            .email-body { padding: 32px 24px; }
            .greeting { font-size: 21px; }
            .email-footer { padding: 22px 20px; }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <div class="email-header">
                <div class="logo">CareerK</div>
                <div class="header-subtitle">New scraped-job matches are ready</div>
            </div>

            <div class="email-body">
                <div class="greeting">Hi ${safeUserName},</div>

                <div class="message">
                    We found new job matches for you from the latest scraped-job matching run.
                </div>

                <div class="count-card">
                    <div class="count-number">${params.totalMatches}</div>
                    <div class="count-text">new matched job${params.totalMatches === 1 ? '' : 's'} found for your profile</div>
                </div>

                <div class="matches-card">
                    <div class="matches-title">Top matches from this run</div>
                    <ul style="padding-left: 18px;">
                        ${matchItems}
                    </ul>
                    <div class="meta">Matching window: ${this.escapeHtml(windowLabel)}</div>
                </div>

                <div class="footer-message">
                    This email was sent because job match notifications are enabled for your account.
                </div>
            </div>

            <div class="email-footer">
                <div class="divider"></div>
                <p>&copy; ${new Date().getFullYear()} CareerK. All rights reserved.</p>
                <p style="margin-top: 12px;">This is an automated email. Please do not reply to this message.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  private formatApplicationStatus(status: ApplicationStatusEnum): string {
    return status
      .toLowerCase()
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private getApplicationStatusMessage(status: ApplicationStatusEnum): string {
    switch (status) {
      case ApplicationStatusEnum.PENDING:
        return 'Your application is in the queue and waiting for the hiring team to review it.';
      case ApplicationStatusEnum.REVIEWED:
        return 'Your application has been reviewed and is moving through the company evaluation process.';
      case ApplicationStatusEnum.SHORTLISTED:
        return 'Good progress. You have been shortlisted for the next stage of consideration.';
      case ApplicationStatusEnum.INTERVIEW_SCHEDULED:
        return 'The company wants to continue with your application and has marked it as interview scheduled. Check the platform for the next instruction.';
      case ApplicationStatusEnum.REJECTED:
        return 'The company has decided not to move forward with your application at this stage.';
      case ApplicationStatusEnum.HIRED:
        return 'The company has marked your application as hired. Review the platform for any final coordination.';
      case ApplicationStatusEnum.WITHDRAWN:
        return 'This application is now marked as withdrawn and is no longer active.';
      default:
        return 'Your application status has been updated. Open your account to review the latest details.';
    }
  }

  private getApplicationStatusTheme(status: ApplicationStatusEnum) {
    switch (status) {
      case ApplicationStatusEnum.SHORTLISTED:
      case ApplicationStatusEnum.INTERVIEW_SCHEDULED:
      case ApplicationStatusEnum.HIRED:
        return {
          headerStart: '#0f766e',
          headerEnd: '#15803d',
          surface: '#ecfdf5',
          border: '#a7f3d0',
          badgeBackground: '#d1fae5',
          badgeText: '#065f46',
        };
      case ApplicationStatusEnum.REJECTED:
      case ApplicationStatusEnum.WITHDRAWN:
        return {
          headerStart: '#b91c1c',
          headerEnd: '#dc2626',
          surface: '#fef2f2',
          border: '#fecaca',
          badgeBackground: '#fee2e2',
          badgeText: '#991b1b',
        };
      case ApplicationStatusEnum.PENDING:
      case ApplicationStatusEnum.REVIEWED:
      default:
        return {
          headerStart: '#1d4ed8',
          headerEnd: '#2563eb',
          surface: '#eff6ff',
          border: '#bfdbfe',
          badgeBackground: '#dbeafe',
          badgeText: '#1d4ed8',
        };
    }
  }

  private formatDateTime(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
