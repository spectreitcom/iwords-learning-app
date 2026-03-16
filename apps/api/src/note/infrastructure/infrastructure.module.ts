import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { NoteRepository } from '../application/ports/note.repository';
import { PrismaNoteRepository } from './repositories/prisma-note.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: NoteRepository,
      useClass: PrismaNoteRepository,
    },
  ],
  exports: [NoteRepository],
})
export class InfrastructureModule {}
