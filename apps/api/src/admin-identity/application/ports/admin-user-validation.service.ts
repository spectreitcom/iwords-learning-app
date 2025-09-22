export abstract class AdminUserValidationService {
  abstract isEmailTaken(email: string): Promise<boolean>;
}
