export interface SendPasswordResetEmailJob {
  email: string;
  code: string;
  userName?: string;
}
