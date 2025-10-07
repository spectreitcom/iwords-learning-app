import { JsonValue } from '@prisma/client/runtime/library';

export type IntegrationEventType = 'admin-identity.requested-reset-password';

export class IntegrationEvent<T extends Record<string, any> | JsonValue> {
  constructor(
    public readonly type: IntegrationEventType,
    public readonly payload: T,
    public readonly meta: {
      aggregateId: string;
    },
  ) {}
}
