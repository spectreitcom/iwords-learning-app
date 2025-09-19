export abstract class ExpressionValidationService {
  abstract checkPhrase(phrase: string): Promise<string | null>;
  abstract exists(expressionId: string): Promise<boolean>;
}
