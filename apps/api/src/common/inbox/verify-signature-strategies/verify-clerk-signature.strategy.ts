import { VerifySignatureStrategy } from './verify-signature.strategy';
import { AppError } from '../../errors';
import { Webhook } from 'svix';

export class VerifyClerkSignatureStrategy implements VerifySignatureStrategy {
  constructor(
    private readonly headers: Record<string, string>,
    private readonly webhookSecret: string,
    private readonly payload: Record<string, any>,
  ) {}

  async verify(): Promise<boolean> {
    const svixId = this.headers['svix-id'];
    const svixTimestamp = this.headers['svix-timestamp'];
    const svixSignature = this.headers['svix-signature'];

    if (!svixId || !svixTimestamp || !svixSignature) {
      throw new AppError('VALIDATION_ERROR', 'Missing required headers');
    }

    const wh = new Webhook(this.webhookSecret);

    await wh.verify(JSON.stringify(this.payload), this.headers);

    return true;
  }
}
