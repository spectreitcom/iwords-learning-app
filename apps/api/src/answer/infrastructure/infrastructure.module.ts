import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AiService } from '../application/ports/ai.service';
import { OpenaiAiService } from './openai-ai.service';
import { AnswerSentenceReadRepository } from '../application/ports/answer-sentence-read.repository';
import { PrismaAnswerSentenceReadRepository } from './prisma/prisma-answer-sentence-read.repository';

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
  ],
  exports: [AiService, AnswerSentenceReadRepository],
})
export class InfrastructureModule {}
