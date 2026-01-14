import { AdminUserValidationService } from '../../../ports/admin-user-validation.service';

export class FakeAdminUserValidationService
  implements AdminUserValidationService
{
  private takenEmails: Set<string> = new Set();
  private superUsers: Set<string> = new Set();

  async isEmailTaken(email: string): Promise<boolean> {
    return this.takenEmails.has(email);
  }

  async isSuperUser(adminUserId: string): Promise<boolean> {
    return this.superUsers.has(adminUserId);
  }

  // Helper methods for tests
  setEmailTaken(email: string) {
    this.takenEmails.add(email);
  }

  setSuperUser(adminUserId: string) {
    this.superUsers.add(adminUserId);
  }
}
