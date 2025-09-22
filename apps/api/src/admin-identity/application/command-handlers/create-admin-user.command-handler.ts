import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAdminUserCommand } from '../commands/create-admin-user.command';
import { AdminUserRepository } from '../ports/admin-user.repository';
import { HashingService } from '../ports/hashing.service';
import { AdminUserValidationService } from '../ports/admin-user-validation.service';
import { AdminIdentityEmailTakenError } from '../errors';
import { AdminUser } from '../../domain/admin-user';

@CommandHandler(CreateAdminUserCommand)
export class CreateAdminUserCommandHandler
  implements ICommandHandler<CreateAdminUserCommand, void>
{
  constructor(
    private readonly adminUserRepository: AdminUserRepository,
    private readonly hashingService: HashingService,
    private readonly adminUserValidationService: AdminUserValidationService,
  ) {}

  async execute(command: CreateAdminUserCommand): Promise<void> {
    const { name, password, isSuperuser, email } = command;

    const isEmailTaken =
      await this.adminUserValidationService.isEmailTaken(email);

    if (isEmailTaken) throw new AdminIdentityEmailTakenError(email);

    const hashedPassword = await this.hashingService.hash(password);

    const adminUser = AdminUser.create(
      email,
      name,
      hashedPassword,
      isSuperuser,
    );
    await this.adminUserRepository.save(adminUser);
  }
}
