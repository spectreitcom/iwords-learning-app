import { AdminUserView } from '../../views/admin-user.view';
import { LoginCommandResponse } from '../command-handlers/login.command-handler';

export abstract class AdminIdentityApi {
  abstract getUserById(adminUserId: string): Promise<AdminUserView>;

  abstract createAdminUser(
    email: string,
    password: string,
    name: string,
    isSuperuser: boolean,
  ): Promise<void>;

  abstract signIn(userId: string): Promise<LoginCommandResponse>;

  abstract validateUser(
    email: string,
    password: string,
  ): Promise<AdminUserView>;
}
