import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../queries/get-user-by-id.query';
import { AdminUserView } from '../../views/admin-user.view';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { AppError } from '../../../common/errors';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler implements IQueryHandler<
  GetUserByIdQuery,
  AdminUserView
> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetUserByIdQuery): Promise<AdminUserView> {
    const { adminUserId } = query;

    const adminUser = await this.prismaService.adminUser.findUnique({
      where: {
        id: adminUserId,
      },
    });

    if (!adminUser)
      throw new AppError(
        'ENTITY_NOT_FOUND',
        `Admin user with id ${adminUserId} not found`,
      );

    return new AdminUserView(
      adminUser.id,
      adminUser.email,
      adminUser.name,
      adminUser.blocked,
    );
  }
}
