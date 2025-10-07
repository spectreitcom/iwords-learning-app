import { BaseEmail } from '../base-email';

export abstract class EmailService {
  abstract send(email: BaseEmail): Promise<void>;
}
