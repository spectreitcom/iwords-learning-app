import { CreateAdminUserCommandHandler } from '../create-admin-user.command-handler';
import { FakeAdminUserRepository } from './fakes/fake-admin-user.repository';
import { FakeAdminUserValidationService } from './fakes/fake-admin-user-validation.service';
import { FakeHashingService } from './fakes/fake-hashing.service';
import { CreateAdminUserCommand } from '../../commands/create-admin-user.command';
import { AppError } from '../../../../common/errors';

describe('CreateAdminUserCommandHandler', () => {
  let adminUserRepository: FakeAdminUserRepository;
  let adminUserValidationService: FakeAdminUserValidationService;
  let hashingService: FakeHashingService;
  let handler: CreateAdminUserCommandHandler;

  beforeEach(() => {
    adminUserRepository = new FakeAdminUserRepository();
    adminUserValidationService = new FakeAdminUserValidationService();
    hashingService = new FakeHashingService();
    handler = new CreateAdminUserCommandHandler(
      adminUserRepository,
      hashingService,
      adminUserValidationService,
    );
  });

  it('should create a new admin user', async () => {
    const email = 'admin@example.com';
    const name = 'Admin User';
    const password = 'password123';
    const isSuperuser = true;
    const command = new CreateAdminUserCommand(
      email,
      password,
      name,
      isSuperuser,
    );

    await handler.execute(command);

    const createdUser = await adminUserRepository.findByEmail(email);
    expect(createdUser).toBeTruthy();
    expect(createdUser?.getName()).toBe(name);
    expect(createdUser?.getEmail().value).toBe(email);
    expect(createdUser?.getIsSuperuser()).toBe(isSuperuser);
    expect(createdUser?.getHashedPassword()).toBe(`hashed-${password}`);
  });

  it('should throw error when email is already taken', async () => {
    const email = 'taken@example.com';
    adminUserValidationService.setEmailTaken(email);
    const command = new CreateAdminUserCommand(email, 'pass', 'Name', false);

    await expect(handler.execute(command)).rejects.toThrow(
      new AppError('ALREADY_EXISTS', `Email ${email} is already taken`),
    );
  });
});
