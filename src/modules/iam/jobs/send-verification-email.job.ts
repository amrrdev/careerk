export interface SendVerificationEmailJob {
  email: string;
  code: string;
  // userType: UserType;
  userName: string;
}
