export type User = {
  id: string;
  email: string;
  name: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};
