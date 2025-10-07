import { BaseEmail } from '../base-email';

export class RequestedResetPasswordEmail extends BaseEmail {
  constructor(recipient: string, token: string) {
    super(recipient, 'test email', `test email ${token}`);
  }
}
