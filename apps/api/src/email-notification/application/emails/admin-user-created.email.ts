import { BaseEmail } from './base-email';

export class AdminUserCreatedEmail extends BaseEmail {
  constructor(recipient: string) {
    super(
      recipient,
      'Witaj w aplikacji iWords',
      `
        <html lang="pl">
            <p>Dziękujemy za skorzystanie z aplikacji iWords</p>
        </html>
      `,
    );
  }
}
