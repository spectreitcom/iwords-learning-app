export type InboxSource = 'clerk';

export type InboxReceiveInput = {
  payload: Record<string, any>;
  topic: string;
  source: InboxSource;
};

export abstract class InboxRouterHandler {
  abstract handle(input: InboxReceiveInput): Promise<void>;
}
