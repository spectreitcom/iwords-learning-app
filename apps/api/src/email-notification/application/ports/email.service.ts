import { BaseEmail } from '../emails/base-email';

export abstract class EmailService {
  abstract send(email: BaseEmail): Promise<void>;
}
