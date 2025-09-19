import { AggregateRoot } from '@nestjs/cqrs';
import { ExpressionContextId } from './value-objects/expression-context-id';
import { ExpressionId } from './value-objects/expression-id';
import { ExpressionType } from './value-objects/expression-type';
import { ExpressionContextCreatedEvent } from './events/expression-context-created.event';
import { VerbForms } from './value-objects/verb-forms';

export class ExpressionContext extends AggregateRoot {
  private readonly expressionContextId: ExpressionContextId;
  private readonly expressionId: ExpressionId;
  private translation: string;
  private isCountable: boolean;
  private type: ExpressionType;
  private forms: VerbForms | null;
  private isIrregular: boolean;

  constructor(
    expressionContextId: ExpressionContextId,
    expressionId: ExpressionId,
    translation: string,
    isCountable: boolean,
    type: ExpressionType,
    forms: VerbForms | null,
    isIrregular: boolean,
  ) {
    super();
    this.expressionContextId = expressionContextId;
    this.expressionId = expressionId;
    this.translation = translation;
    this.isCountable = isCountable;
    this.type = type;
    this.forms = forms ? forms : null;
    this.isIrregular = isIrregular;
  }

  static createVerb(translation: string, expressionId: string) {
    const expressionContext = new ExpressionContext(
      ExpressionContextId.create(),
      ExpressionId.fromString(expressionId),
      translation,
      true,
      ExpressionType.verb(),
      null,
      false,
    );

    expressionContext.apply(
      new ExpressionContextCreatedEvent(
        expressionContext.getExpressionContextId().value,
        expressionContext.getExpressionId().value,
        expressionContext.getTranslation(),
        false,
        expressionContext.getType().value,
        null,
        false,
      ),
    );

    return expressionContext;
  }

  static createIrregularVerb(
    translation: string,
    forms: [string, string, string],
    expressionId: string,
  ) {
    const verbForms = VerbForms.fromArray(forms);

    const expressionContext = new ExpressionContext(
      ExpressionContextId.create(),
      ExpressionId.fromString(expressionId),
      translation,
      false,
      ExpressionType.verb(),
      VerbForms.fromArray(forms),
      true,
    );

    expressionContext.apply(
      new ExpressionContextCreatedEvent(
        expressionContext.getExpressionContextId().value,
        expressionContext.getExpressionId().value,
        expressionContext.getTranslation(),
        false,
        expressionContext.getType().value,
        verbForms.value,
        true,
      ),
    );

    return expressionContext;
  }

  static createAdverb(translation: string, expressionId: string) {
    const expressionContext = new ExpressionContext(
      ExpressionContextId.create(),
      ExpressionId.fromString(expressionId),
      translation,
      false,
      ExpressionType.adverb(),
      null,
      false,
    );

    expressionContext.apply(
      new ExpressionContextCreatedEvent(
        expressionContext.getExpressionContextId().value,
        expressionContext.getExpressionId().value,
        expressionContext.getTranslation(),
        false,
        expressionContext.getType().value,
        null,
        false,
      ),
    );

    return expressionContext;
  }

  static createAdjective(translation: string, expressionId: string) {
    const expressionContext = new ExpressionContext(
      ExpressionContextId.create(),
      ExpressionId.fromString(expressionId),
      translation,
      false,
      ExpressionType.adjective(),
      null,
      false,
    );

    expressionContext.apply(
      new ExpressionContextCreatedEvent(
        expressionContext.getExpressionContextId().value,
        expressionContext.getExpressionId().value,
        expressionContext.getTranslation(),
        false,
        expressionContext.getType().value,
        null,
        false,
      ),
    );

    return expressionContext;
  }

  static createNoun(
    translation: string,
    expressionId: string,
    isCountable: boolean,
  ) {
    const expressionContext = new ExpressionContext(
      ExpressionContextId.create(),
      ExpressionId.fromString(expressionId),
      translation,
      isCountable,
      ExpressionType.noun(),
      null,
      false,
    );

    expressionContext.apply(
      new ExpressionContextCreatedEvent(
        expressionContext.getExpressionContextId().value,
        expressionContext.getExpressionId().value,
        expressionContext.getTranslation(),
        false,
        expressionContext.getType().value,
        null,
        false,
      ),
    );

    return expressionContext;
  }

  static createPhrasalVerb(translation: string, expressionId: string) {
    const expressionContext = new ExpressionContext(
      ExpressionContextId.create(),
      ExpressionId.fromString(expressionId),
      translation,
      false,
      ExpressionType.phrasalVerb(),
      null,
      false,
    );

    expressionContext.apply(
      new ExpressionContextCreatedEvent(
        expressionContext.getExpressionContextId().value,
        expressionContext.getExpressionId().value,
        expressionContext.getTranslation(),
        false,
        expressionContext.getType().value,
        null,
        false,
      ),
    );

    return expressionContext;
  }

  getExpressionContextId() {
    return this.expressionContextId;
  }

  getExpressionId() {
    return this.expressionId;
  }

  getTranslation() {
    return this.translation;
  }

  getIsCountable() {
    return this.isCountable;
  }

  getType() {
    return this.type;
  }

  getForms() {
    return this.forms;
  }

  getIsIrregular() {
    return this.isIrregular;
  }
}
