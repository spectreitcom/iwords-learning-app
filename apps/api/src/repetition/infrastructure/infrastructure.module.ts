import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { RepetitionRepository } from '../application/ports/repetition.repository';
import { PrismaRepetitionRepository } from './prisma/prisma-repetition.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: RepetitionRepository,
      useClass: PrismaRepetitionRepository,
    },
  ],
  exports: [RepetitionRepository],
})
export class InfrastructureModule {}
