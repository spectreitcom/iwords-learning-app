import { AdminUserView } from '../../views/admin-user.view';
import { LoginCommandResponse } from '../command-handlers/login.command-handler';
import { RefreshTokenCommandResponse } from '../command-handlers/refresh-token.command-handler';

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

  abstract refreshToken(
    refreshToken: string,
  ): Promise<RefreshTokenCommandResponse>;

  abstract signOut(userId: string): Promise<void>;

  abstract changeLoggedUserPassword(
    userId: string,
    existingPassword: string,
    newPassword: string,
  ): Promise<void>;

  abstract blockAdminUser(
    adminUserId: string,
    userToBlockId: string,
  ): Promise<void>;

  abstract unblockAdminUser(
    adminUserId: string,
    userToUnblockId: string,
  ): Promise<void>;
}
