import { AdminUserView } from '../../views/admin-user.view';

export abstract class AdminUserApi {
  abstract getUserById(adminUserId: string): Promise<AdminUserView>;
}
