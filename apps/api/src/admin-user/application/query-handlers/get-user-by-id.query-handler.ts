import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../queries/get-user-by-id.query';
import { AdminUserView } from '../../views/admin-user.view';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { AdminUserNotFoundError } from '../errors';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler
  implements IQueryHandler<GetUserByIdQuery, AdminUserView>
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetUserByIdQuery): Promise<AdminUserView> {
    const { adminUserId } = query;

    const adminUser = await this.prismaService.adminUser.findUnique({
      where: {
        id: adminUserId,
      },
    });

    if (!adminUser) throw new AdminUserNotFoundError(adminUserId);

    return new AdminUserView(adminUser.id, adminUser.email, adminUser.name);
  }
}
