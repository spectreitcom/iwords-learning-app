import { User } from '../../domain/user';
import { PrismaTx } from '../../../common/types';

export abstract class UserRepository {
  abstract save(user: User): Promise<void>;
  abstract findById(userId: string): Promise<User | null>;
  abstract findByClerkId(clerkId: string): Promise<User | null>;
  abstract delete(userId: string, tx?: PrismaTx): Promise<void>;
}
