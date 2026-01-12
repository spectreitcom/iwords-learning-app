import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AiService } from '../application/ports/ai.service';
import { OpenaiAiService } from './openai-ai.service';
import { AnswerSentenceReadRepository } from '../application/ports/answer-sentence-read.repository';
import { PrismaAnswerSentenceReadRepository } from './prisma/prisma-answer-sentence-read.repository';
import { AnswerExpressionContextReadRepository } from '../application/ports/answer-expression-context-read.repository';
import { PrismaAnswerExpressionContextReadRepository } from './prisma/prisma-answer-expression-context-read.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: AiService,
      useClass: OpenaiAiService,
    },
    {
      provide: AnswerSentenceReadRepository,
      useClass: PrismaAnswerSentenceReadRepository,
    },
    {
      provide: AnswerExpressionContextReadRepository,
      useClass: PrismaAnswerExpressionContextReadRepository,
    },
  ],
  exports: [
    AiService,
    AnswerSentenceReadRepository,
    AnswerExpressionContextReadRepository,
  ],
})
export class InfrastructureModule {}
