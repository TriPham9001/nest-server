export interface IJWTConfigOptions {
  googleClientId: string;
  googleClientSecret: string;
  jwtAccessExpirationMinutes: number;
  jwtRefreshExpirationDays: number;
  jwtVerifyEmailExpirationMinutes: number;
  jwtWorkspaceInvitationExpirationDays: number;
  jwtSecret: string;
  allowedEmails: string[];
}
