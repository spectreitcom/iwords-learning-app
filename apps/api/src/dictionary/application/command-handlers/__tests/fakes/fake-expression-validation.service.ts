import { ExpressionValidationService } from '../../../ports/expression-validation.service';

export class FakeExpressionValidationService
  implements ExpressionValidationService
{
  private readonly existingIds = new Set<string>();
  private phraseCheckResult: string | null = null;

  async checkPhrase(phrase: string): Promise<string | null> {
    return this.phraseCheckResult;
  }

  async exists(expressionId: string): Promise<boolean> {
    return this.existingIds.has(expressionId);
  }

  // Helper methods for tests
  setPhraseCheckResult(result: string | null) {
    this.phraseCheckResult = result;
  }

  addExistingId(id: string) {
    this.existingIds.add(id);
  }
}
