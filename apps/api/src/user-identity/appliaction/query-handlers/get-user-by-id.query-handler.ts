import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../queries/get-user-by-id.query';
import { UserView } from '../../views/user.view';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { AppError } from '../../../common/errors';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler implements IQueryHandler<
  GetUserByIdQuery,
  UserView
> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetUserByIdQuery): Promise<UserView> {
    const { userId } = query;
    const record = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!record) throw new AppError('ENTITY_NOT_FOUND', 'User not found');

    return new UserView(record.id, record.email, record.name, record.blocked);
  }
}
