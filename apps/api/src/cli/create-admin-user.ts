import { Command, CommandRunner, Option } from 'nest-commander';
import { isEmail } from 'class-validator';
import { AdminUserApiService } from '../admin-identity/application/services/admin-user-api.service';

@Command({ name: 'create-admin-user', description: 'Create admin user' })
export class CreateAdminUser extends CommandRunner {
  constructor(private readonly adminUserApiService: AdminUserApiService) {
    super();
  }

  async run(
    _: string[],
    opts: { email: string; password: string; name: string },
  ) {
    console.log('Creating admin user...');
    const { email, password, name } = opts;
    try {
      await this.adminUserApiService.createAdminUser(
        email,
        password,
        name,
        true,
      );
      console.log('Admin user created successfully');
      process.exit(0);
    } catch {
      console.log('Admin user already exists');
      process.exit(1);
    }
  }

  @Option({ flags: '-e, --email <email>', required: true }) parseEmail(
    v: string,
  ) {
    if (!isEmail(v)) throw new Error('Invalid email');
    return v;
  }

  @Option({ flags: '-p, --password <password>', required: true }) parsePassword(
    v: string,
  ) {
    return v;
  }

  @Option({ flags: '-n, --name <name>', required: true }) parseName(v: string) {
    return v;
  }
}
