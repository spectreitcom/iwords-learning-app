import { AdminUserRepository } from '../../../ports/admin-user.repository';
import { AdminUser } from '../../../../domain/admin-user';
import { PrismaTx } from '../../../../../common/types';

export class FakeAdminUserRepository implements AdminUserRepository {
  private readonly data = new Map<string, AdminUser>();

  async save(adminUser: AdminUser, tx?: PrismaTx): Promise<void> {
    this.data.set(adminUser.getAdminUserId().value, adminUser);
  }

  async findById(
    adminUserId: string,
    tx?: PrismaTx,
  ): Promise<AdminUser | null> {
    return this.data.get(adminUserId) || null;
  }

  async findByEmail(email: string, tx?: PrismaTx): Promise<AdminUser | null> {
    return (
      Array.from(this.data.values()).find(
        (user) => user.getEmail().value === email,
      ) || null
    );
  }

  async findByResetPasswordToken(
    token: string,
    tx?: PrismaTx,
  ): Promise<AdminUser | null> {
    return (
      Array.from(this.data.values()).find(
        (user) => user.getResetPasswordToken() === token,
      ) || null
    );
  }

  // Helper method for tests
  getLength(): number {
    return this.data.size;
  }
}
