import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBoxByIdQuery } from '../queries/get-box-by-id.query';
import { BoxView } from '../../view/box.view';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { AppError } from '../../../common/errors';

@QueryHandler(GetBoxByIdQuery)
export class GetBoxByIdQueryHandler
  implements IQueryHandler<GetBoxByIdQuery, BoxView>
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetBoxByIdQuery): Promise<BoxView> {
    const { boxId } = query;

    const record = await this.prismaService.box.findUnique({
      where: { id: boxId },
    });

    if (!record)
      throw new AppError('ENTITY_NOT_FOUND', `Box with id ${boxId} not found`);

    return new BoxView(record.id, record.title, record.expressionContextIds);
  }
}
