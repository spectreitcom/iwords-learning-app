import { ResetPasswordTokensStorage } from '../../../ports/reset-password-tokens.storage';

export class FakeResetPasswordTokensStorage
  implements ResetPasswordTokensStorage
{
  private readonly storage = new Map<string, string>();

  async insert(userId: string, token: string): Promise<void> {
    this.storage.set(userId, token);
  }

  async remove(userId: string): Promise<void> {
    this.storage.delete(userId);
  }

  async getToken(userId: string): Promise<string | null> {
    return this.storage.get(userId) || null;
  }

  async validate(userId: string): Promise<boolean> {
    return this.storage.has(userId);
  }
}
