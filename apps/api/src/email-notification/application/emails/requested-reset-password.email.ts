import { BaseEmail } from './base-email';

export class RequestedResetPasswordEmail extends BaseEmail {
  constructor(recipient: string, frontendUrl: string, token: string) {
    super(
      recipient,
      'Zmiana hasła',
      `
        <html lang="pl">
            <h1>Resetowanie hasła</h1>
            <p>Kliknij link poniżej aby zresetować hasło</p>
            <a href="${frontendUrl}/auth/reset-password?token=${token}">Zresetuj hasło</a>
        </html>
      `,
    );
  }
}
