export abstract class AdminUserValidationService {
  abstract isEmailTaken(email: string): Promise<boolean>;
  abstract isSuperUser(adminUserId: string): Promise<boolean>;
}
