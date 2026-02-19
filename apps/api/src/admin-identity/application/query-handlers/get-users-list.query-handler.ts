import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUsersListQuery } from '../queries/get-users-list.query';
import { CollectionWithPagination } from '../../../common/types';
import { AdminUserView } from '../../views/admin-user.view';
import { PrismaService } from '../../../common/prisma/prisma.service';

export type GetUsersListQueryResponse = CollectionWithPagination<AdminUserView>;

@QueryHandler(GetUsersListQuery)
export class GetUsersListQueryHandler implements IQueryHandler<
  GetUsersListQuery,
  GetUsersListQueryResponse
> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetUsersListQuery): Promise<GetUsersListQueryResponse> {
    const { take, page, adminUserId } = query;

    const records = await this.prismaService.adminUser.findMany({
      where: {
        NOT: {
          id: adminUserId,
        },
      },
      take,
      skip: (page - 1) * take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await this.prismaService.adminUser.count({
      where: {
        NOT: {
          id: adminUserId,
        },
      },
    });

    const data: AdminUserView[] = records.map(
      (record) =>
        new AdminUserView(record.id, record.email, record.name, record.blocked),
    );

    return {
      data,
      total,
      currentPage: page,
    };
  }
}
