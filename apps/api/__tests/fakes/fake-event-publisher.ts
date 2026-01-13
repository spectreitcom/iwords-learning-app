import { AsyncContext } from '@nestjs/cqrs';

export class FakeEventPublisher {
  mergeObjectContext<T>(object: T, asyncContext?: AsyncContext): T {
    return {} as T;
  }
}
