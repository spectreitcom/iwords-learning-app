import { AdminUserId } from './value-objects/admin-user-id';
import { AdminUserEmail } from './value-objects/admin-user-email';

export class AdminUser {
  private readonly adminUserId: AdminUserId;
  private readonly email: AdminUserEmail;
  private readonly name: string;
  private hashedPassword: string | null;
  private readonly isSuperuser: boolean;
  private blocked: boolean;
  private resetPasswordToken: string | null;

  constructor(
    adminUserId: AdminUserId,
    email: AdminUserEmail,
    name: string,
    hashedPassword: string | null,
    isSuperuser: boolean,
    blocked: boolean = false,
    resetPasswordToken: string | null = null,
  ) {
    this.adminUserId = adminUserId;
    this.email = email;
    this.name = name;
    this.hashedPassword = hashedPassword;
    this.isSuperuser = isSuperuser;
    this.blocked = blocked;
    this.resetPasswordToken = resetPasswordToken;
  }

  static create(
    email: string,
    name: string,
    hashedPassword: string | null,
    isSuperuser: boolean,
  ) {
    return new AdminUser(
      AdminUserId.create(),
      AdminUserEmail.fromString(email),
      name,
      hashedPassword,
      isSuperuser,
      false,
    );
  }

  updateHashedPassword(newHashedPassword: string) {
    this.hashedPassword = newHashedPassword;
    this.resetPasswordToken = null;
  }

  updateResetPasswordToken(newResetPasswordToken: string) {
    this.resetPasswordToken = newResetPasswordToken;
  }

  block() {
    this.blocked = true;
  }

  unblock() {
    this.blocked = false;
  }

  getAdminUserId() {
    return this.adminUserId;
  }

  getEmail() {
    return this.email;
  }

  getName() {
    return this.name;
  }

  getIsSuperuser() {
    return this.isSuperuser;
  }

  getHashedPassword() {
    return this.hashedPassword;
  }

  getBlocked() {
    return this.blocked;
  }

  getResetPasswordToken() {
    return this.resetPasswordToken;
  }
}
