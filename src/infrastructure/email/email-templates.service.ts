import { Injectable } from '@nestjs/common';

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
}
