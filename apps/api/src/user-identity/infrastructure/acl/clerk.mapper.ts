import { ClerkUserCreatedEvent, ClerkUserDeletedEvent } from './clerk-events';

export class ClerkMapper {
  static mapUserCreated(event: ClerkUserCreatedEvent) {
    const data = event.data;

    const email = data.email_addresses?.[0]?.email_address ?? '';

    return {
      name: `${data.first_name} ${data.last_name}`.trim(),
      email,
      clerkId: data.id,
    };
  }

  static mapUserDeleted(event: ClerkUserDeletedEvent) {
    const data = event.data;
    return {
      clerkId: data.id,
    };
  }
}
