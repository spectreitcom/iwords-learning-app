export class AdminUserNotFoundError extends Error {
  constructor(adminUserId: string) {
    super(`Admin user with id ${adminUserId} not found`);
  }
}

export class AdminUserEmailTakenError extends Error {
  constructor(email: string) {
    super(`Admin user with email ${email} already exists`);
  }
}
