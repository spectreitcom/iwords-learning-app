import { BaseEmail } from '../../infrastructure/base-email';

export abstract class EmailService {
  abstract send(email: BaseEmail): Promise<void>; // todo;
}
