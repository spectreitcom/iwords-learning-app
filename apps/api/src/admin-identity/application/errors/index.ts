export class AdminIdentityNotFoundError extends Error {
  constructor(adminUserId: string) {
    super(`Admin identity with id ${adminUserId} not found`);
  }
}

export class AdminIdentityEmailTakenError extends Error {
  constructor(email: string) {
    super(`Admin identity with email ${email} already exists`);
  }
}

export class WrongEmailOrPasswordError extends Error {
  constructor() {
    super('Wrong email or password');
  }
}

export class InvalidRefreshTokenError extends Error {
  constructor() {
    super('Invalid refresh token');
  }
}
