import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUsersListQuery } from '../queries/get-users-list.query';
import { CollectionWithPagination } from 'admin/src/lib/types';
import { UserView } from '../../views/user.view';
import { PrismaService } from '../../../common/prisma/prisma.service';

export type GetUsersListQueryResponse = CollectionWithPagination<UserView>;

@QueryHandler(GetUsersListQuery)
export class GetUsersListQueryHandler
  implements IQueryHandler<GetUsersListQuery, GetUsersListQueryResponse>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetUsersListQuery): Promise<GetUsersListQueryResponse> {
    const { take, page } = query;

    const records = await this.prisma.user.findMany({
      take,
      skip: (page - 1) * take,
    });

    const total = await this.prisma.user.count();

    const data: UserView[] = records.map(
      (record) =>
        new UserView(record.id, record.email, record.name, record.blocked),
    );

    return {
      data,
      total,
      currentPage: page,
    };
  }
}
