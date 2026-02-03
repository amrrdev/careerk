import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  user: process.env.GMAIL_USER,
  pass: process.env.GMAIL_PASSWORD,
  secure: Boolean(process.env.SMTP_SECURE || 'false'),
}));
