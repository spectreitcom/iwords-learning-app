import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AiService } from '../application/ports/ai.service';
import { OpenaiAiService } from './openai-ai.service';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: AiService,
      useClass: OpenaiAiService,
    },
  ],
  exports: [AiService],
})
export class InfrastructureModule {}
