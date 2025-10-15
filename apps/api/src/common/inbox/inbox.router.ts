import { InboxReceiveInput } from './types';

export type InboxRouterFn = (msg: InboxReceiveInput) => Promise<void>;

export const INBOX_ROUTER = Symbol('INBOX_ROUTER');
