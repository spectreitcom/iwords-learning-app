import { AdminUserId } from './value-objects/admin-user-id';
import { AdminUserEmail } from './value-objects/admin-user-email';

export class AdminUser {
  private readonly adminUserId: AdminUserId;
  private readonly email: AdminUserEmail;
  private readonly name: string;
  private readonly hashedPassword: string | null;
  private readonly isSuperuser: boolean;

  constructor(
    adminUserId: AdminUserId,
    email: AdminUserEmail,
    name: string,
    hashedPassword: string | null,
    isSuperuser: boolean,
  ) {
    this.adminUserId = adminUserId;
    this.email = email;
    this.name = name;
    this.hashedPassword = hashedPassword;
    this.isSuperuser = isSuperuser;
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
    );
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
}
