import { UserRepository } from '../../../ports/user.repository';
import { User } from '../../../../domain/user';
import { PrismaTx } from '../../../../../common/types';

export class FakeUserRepository implements UserRepository {
  private readonly data = new Map<string, User>();

  async save(user: User): Promise<void> {
    this.data.set(user.getUserId().value, user);
  }

  async findById(userId: string): Promise<User | null> {
    return this.data.get(userId) || null;
  }

  async findByClerkId(clerkId: string): Promise<User | null> {
    return (
      Array.from(this.data.values()).find(
        (user) => user.getClerkId() === clerkId,
      ) || null
    );
  }

  async delete(userId: string, tx?: PrismaTx): Promise<void> {
    this.data.delete(userId);
  }

  // Helper method for tests
  getLength(): number {
    return this.data.size;
  }
}
