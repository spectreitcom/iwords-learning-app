import { UserId } from './value-objects/user-id';
import { UserEmail } from './value-objects/user-email';

export class User {
  private readonly userId: UserId;
  private readonly clerkId: string;
  private readonly email: UserEmail;
  private readonly name: string;
  private blocked: boolean;
  private readonly provider: string;

  constructor(
    userId: UserId,
    clerkId: string,
    email: UserEmail,
    name: string,
    blocked: boolean,
    provider: string,
  ) {
    this.userId = userId;
    this.clerkId = clerkId;
    this.email = email;
    this.name = name;
    this.blocked = blocked;
    this.provider = provider;
  }

  static create(
    clerkId: string,
    email: string,
    name: string,
    provider: string,
  ) {
    return new User(
      UserId.create(),
      clerkId,
      UserEmail.fromString(email),
      name,
      false,
      provider,
    );
  }

  block() {
    this.blocked = true;
  }

  unblock() {
    this.blocked = false;
  }

  getUserId(): UserId {
    return this.userId;
  }

  getClerkId(): string {
    return this.clerkId;
  }

  getEmail(): UserEmail {
    return this.email;
  }

  getName(): string {
    return this.name;
  }

  getBlocked(): boolean {
    return this.blocked;
  }

  getProvider(): string {
    return this.provider;
  }
}
