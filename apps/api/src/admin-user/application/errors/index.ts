export class AdminUserNotFoundError extends Error {
  constructor(adminUserId: string) {
    super(`Admin user with id ${adminUserId} not found`);
  }
}
