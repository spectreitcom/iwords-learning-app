import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSentenceByIdQuery } from '../queries/get-sentence-by-id.query';
import { SentenceView } from '../../views/sentence.view';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { SentenceNotFoundError } from '../errors';

@QueryHandler(GetSentenceByIdQuery)
export class GetSentenceByIdQueryHandler
  implements IQueryHandler<GetSentenceByIdQuery, SentenceView>
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetSentenceByIdQuery): Promise<SentenceView> {
    const { sentenceId } = query;
    const sentence = await this.prismaService.sentence.findUnique({
      where: {
        id: sentenceId,
      },
    });

    if (!sentence) throw new SentenceNotFoundError(sentenceId);

    return new SentenceView(
      sentence.id,
      sentence.content,
      sentence.translation,
    );
  }
}
