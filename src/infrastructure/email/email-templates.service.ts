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
}
