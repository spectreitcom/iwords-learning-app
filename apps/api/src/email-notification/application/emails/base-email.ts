export abstract class BaseEmail {
  protected constructor(
    public readonly recipient: string,
    public readonly subject: string,
    public readonly body?: string,
    public readonly template?: string,
    public readonly context?: Record<string, any>,
  ) {}
}
