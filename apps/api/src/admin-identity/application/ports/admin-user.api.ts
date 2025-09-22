import { AdminUserView } from '../../views/admin-user.view';

export abstract class AdminUserApi {
  abstract getUserById(adminUserId: string): Promise<AdminUserView>;
  abstract createAdminUser(
    email: string,
    password: string,
    name: string,
    isSuperuser: boolean,
  ): Promise<void>;
}
