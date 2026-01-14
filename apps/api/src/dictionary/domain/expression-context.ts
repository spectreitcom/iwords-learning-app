import { AggregateRoot } from '@nestjs/cqrs';
import { ExpressionContextId } from './value-objects/expression-context-id';
import { ExpressionId } from './value-objects/expression-id';
import { ExpressionType } from './value-objects/expression-type';
import { ExpressionContextCreatedEvent } from './events/expression-context-created.event';
import { VerbForms } from './value-objects/verb-forms';
import { ExpressionContextDeletedEvent } from './events/expression-context-deleted.event';
import { ExpressionContextUpdatedEvent } from './events/expression-context-updated.event';

export class ExpressionContext extends AggregateRoot {
  private readonly expressionContextId: ExpressionContextId;
  private readonly expressionId: ExpressionId;
  private translation: string;
  private isCountable: boolean;
  private readonly type: ExpressionType;
  private forms: VerbForms | null;
  private readonly isIrregular: boolean;
  private definition: string | null = null;
  private definitionTranslation: string | null = null;

  constructor(
    expressionContextId: ExpressionContextId,
    expressionId: ExpressionId,
    translation: string,
    isCountable: boolean,
    type: ExpressionType,
    forms: VerbForms | null,
    isIrregular: boolean,
    definition: string | null,
    definitionTranslation: string | null,
  ) {
    super();
    this.expressionContextId = expressionContextId;
    this.expressionId = expressionId;
    this.translation = translation;
    this.isCountable = isCountable;
    this.type = type;
    this.forms = forms ?? null;
    this.isIrregular = isIrregular;
    this.definition = definition;
    this.definitionTranslation = definitionTranslation;
  }

  static createVerb(translation: string, expressionId: string) {
    const expressionContext = new ExpressionContext(
      ExpressionContextId.create(),
      ExpressionId.fromString(expressionId),
      translation,
      false,
      ExpressionType.verb(),
      null,
      false,
      null,
      null,
    );

    this.applyCreateEvent(expressionContext);

    return expressionContext;
  }

  static createIrregularVerb(
    translation: string,
    forms: [string, string, string],
    expressionId: string,
  ) {
    const expressionContext = new ExpressionContext(
      ExpressionContextId.create(),
      ExpressionId.fromString(expressionId),
      translation,
      false,
      ExpressionType.irregularVerb(),
      VerbForms.fromArray(forms),
      true,
      null,
      null,
    );

    this.applyCreateEvent(expressionContext);

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
      null,
      null,
    );

    this.applyCreateEvent(expressionContext);

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
      null,
      null,
    );

    this.applyCreateEvent(expressionContext);

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
      null,
      null,
    );

    this.applyCreateEvent(expressionContext);

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
      null,
      null,
    );

    this.applyCreateEvent(expressionContext);

    return expressionContext;
  }

  static crateSimpleExpression(translation: string, expressionId: string) {
    const expressionContext = new ExpressionContext(
      ExpressionContextId.create(),
      ExpressionId.fromString(expressionId),
      translation,
      false,
      ExpressionType.simpleExpression(),
      null,
      false,
      null,
      null,
    );

    this.applyCreateEvent(expressionContext);

    return expressionContext;
  }

  delete() {
    this.apply(
      new ExpressionContextDeletedEvent(
        this.expressionContextId.value,
        this.expressionId.value,
      ),
    );
  }

  updateVerb(translation: string) {
    this.translation = translation;
    this.applyUpdateEvent();
  }

  updateIrregularVerb(translation: string, forms: [string, string, string]) {
    this.translation = translation;
    this.forms = VerbForms.fromArray(forms);
    this.applyUpdateEvent();
  }

  updateAdverb(translation: string) {
    this.translation = translation;
    this.applyUpdateEvent();
  }

  updateAdjective(translation: string) {
    this.translation = translation;
    this.applyUpdateEvent();
  }

  updateNoun(translation: string, isCountable: boolean) {
    this.translation = translation;
    this.isCountable = isCountable;
    this.applyUpdateEvent();
  }

  updatePhrasalVerb(translation: string) {
    this.translation = translation;
    this.applyUpdateEvent();
  }

  updateSimpleExpression(translation: string) {
    this.translation = translation;
    this.applyUpdateEvent();
  }

  updateDefinition(definition: string, definitionTranslation: string) {
    this.definition = definition;
    this.definitionTranslation = definitionTranslation;
    this.applyUpdateEvent();
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

  getDefinition() {
    return this.definition;
  }

  getDefinitionTranslation() {
    return this.definitionTranslation;
  }

  private static applyCreateEvent(expressionContext: ExpressionContext) {
    expressionContext.apply(
      new ExpressionContextCreatedEvent(
        expressionContext.getExpressionContextId().value,
        expressionContext.getExpressionId().value,
        expressionContext.getTranslation(),
        expressionContext.getIsCountable(),
        expressionContext.getType().value,
        expressionContext.getForms()?.value ?? null,
        expressionContext.getIsIrregular(),
      ),
    );
  }

  private applyUpdateEvent() {
    this.apply(
      new ExpressionContextUpdatedEvent(
        this.expressionContextId.value,
        this.expressionId.value,
        this.translation,
        this.isCountable,
        this.type.value,
        this.forms?.value ?? null,
        this.isIrregular,
        this.definition,
        this.definitionTranslation,
      ),
    );
  }
}
