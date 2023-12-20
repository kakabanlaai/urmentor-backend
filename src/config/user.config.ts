import { registerAs } from '@nestjs/config';

export default registerAs('user', () => ({
  verifyMailTtl: parseInt(process.env.VERIFY_MAIL_TOKEN_TTL ?? '3600', 10),
  recoveryPassTtl: parseInt(
    process.env.RECOVERY_PASSWORD_TOKEN_TTL ?? '3600',
    10,
  ),
}));
