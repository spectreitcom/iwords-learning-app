import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { GenerateRepetitionService } from '../application/ports/generate-repetition.service';
import { BasicRepetitionGeneratorService } from './basic-repetition-generator.service';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: GenerateRepetitionService,
      useClass: BasicRepetitionGeneratorService,
    },
  ],
  exports: [GenerateRepetitionService],
})
export class InfrastructureModule {}
