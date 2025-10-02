export type User = {
  adminUserId: string;
  email: string;
  name: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};
