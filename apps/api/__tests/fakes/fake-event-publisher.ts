import { AsyncContext, EventPublisher } from '@nestjs/cqrs';

export class FakeEventPublisher
  implements Pick<EventPublisher, 'mergeObjectContext'>
{
  public lastMerged: any | null = null;

  mergeObjectContext<T>(
    object: T,
    asyncContext?: AsyncContext,
  ): T & { commit: () => void } {
    const withCommit = Object.assign(object as any, {
      commit: jest.fn(),
    });
    this.lastMerged = withCommit;
    return withCommit;
  }
}
