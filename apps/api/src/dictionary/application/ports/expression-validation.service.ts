export abstract class ExpressionValidationService {
  abstract checkPhrase(phrase: string): Promise<string | null>;
}
