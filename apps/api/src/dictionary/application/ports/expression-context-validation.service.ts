export abstract class ExpressionContextValidationService {
  abstract exists(expressionContextId: string): Promise<boolean>;
}
