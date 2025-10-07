export abstract class ResetPasswordTokensStorage {
  abstract insert(userId: string, token: string): Promise<void>;
  abstract remove(userId: string): Promise<void>;
  abstract getToken(userId: string): Promise<string | null>;
  abstract validate(userId: string): Promise<boolean>;
}
