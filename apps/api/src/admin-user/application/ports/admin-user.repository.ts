import { AdminUser } from '../../domain/admin-user';

export abstract class AdminUserRepository {
  abstract save(adminUser: AdminUser): Promise<void>;
  abstract findById(adminUserId: string): Promise<AdminUser | null>;
}
