export interface IIntegrationEvent {
  name: string;
  payload: unknown;
  aggregateId: string;
}
