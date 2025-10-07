import { BaseEmail } from './base-email';

export class AdminUserInvitedEmail extends BaseEmail {
  constructor(recipient: string, frontendUrl: string, token: string) {
    super(
      recipient,
      'Zaproszenie do panelu administracyjnego iWords',
      `
        <html lang="pl">
            <h1>Zostałeś zaproszony do panelu administracyjnego iWords</h1>
            <p>Kliknij link poniżej aby aktywować konto</p>
            <a href="${frontendUrl}/auth/reset-password?token=${token}">Zresetuj hasło</a>
        </html>
      `,
    );
  }
}
