export interface ClerkUserCreatedEvent {
  id: string;
  type: 'user.created';
  data: {
    id: string;
    email_addresses?: { email_address: string; id: string }[];
    primary_email_address_id?: string;
    username?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    created_at?: string | number;
    updated_at?: string | number;
  };
}

export interface ClerkUserDeletedEvent {
  type: 'user.deleted';
  data: {
    deleted: boolean;
    id: string;
  };
}
