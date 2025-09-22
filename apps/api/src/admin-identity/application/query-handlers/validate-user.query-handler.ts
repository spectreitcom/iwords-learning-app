import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ValidateUserQuery } from '../queries/validate-user.query';
import { AdminUserView } from '../../views/admin-user.view';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { HashingService } from '../ports/hashing.service';
import { WrongEmailOrPasswordError } from '../errors';

@QueryHandler(ValidateUserQuery)
export class ValidateUserQueryHandler
  implements IQueryHandler<ValidateUserQuery, AdminUserView>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
  ) {}

  async execute(query: ValidateUserQuery): Promise<AdminUserView> {
    const { email, password } = query;

    const adminUser = await this.prismaService.adminUser.findUnique({
      where: {
        email,
      },
    });

    if (!adminUser) throw new WrongEmailOrPasswordError();

    const isPasswordValid = await this.hashingService.compare(
      password,
      adminUser.password ?? '',
    );

    if (!isPasswordValid) throw new WrongEmailOrPasswordError();

    return new AdminUserView(adminUser.id, adminUser.email, adminUser.name);
  }
}
