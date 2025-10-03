export class AdminUserView {
  constructor(
    public readonly adminUserId: string,
    public readonly email: string,
    public readonly name: string,
    public readonly blocked: boolean,
  ) {}
}
