import { SentenceView } from './sentence.view';

export class ExpressionContextView {
  constructor(
    public readonly expressionContextId: string,
    public readonly translation: string,
    public readonly expressionId: string,
    public readonly isCountable: boolean,
    public readonly isIrregular: boolean,
    public readonly type: string,
    public readonly forms: [string, string, string] | null,
    public readonly sentences: SentenceView[],
  ) {}
}
