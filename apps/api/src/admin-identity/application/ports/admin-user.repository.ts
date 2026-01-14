import { AdminUser } from '../../domain/admin-user';
import { PrismaTx } from '../../../common/types';

export abstract class AdminUserRepository {
  abstract save(adminUser: AdminUser, tx?: PrismaTx): Promise<void>;
  abstract findById(
    adminUserId: string,
    tx?: PrismaTx,
  ): Promise<AdminUser | null>;
  abstract findByEmail(email: string, tx?: PrismaTx): Promise<AdminUser | null>;
  abstract findByResetPasswordToken(
    token: string,
    tx?: PrismaTx,
  ): Promise<AdminUser | null>;
}
