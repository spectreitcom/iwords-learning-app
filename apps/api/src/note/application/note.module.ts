import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { NoteApiService } from './note-api.service';
import { CreateNoteCommandHandler } from './command-handlers/create-note.command-handler';
import { DeleteNoteCommandHandler } from './command-handlers/delete-note.command-handler';
import { UpdateNoteContentCommandHandler } from './command-handlers/update-note-content.command-handler';
import { UpdateNoteTitleCommandHandler } from './command-handlers/update-note-title.command-handler';
import { GetNoteQueryHandler } from './query-handlers/get-note.query-handler';
import { GetNotesForExpressionContextQueryHandler } from './query-handlers/get-notes-for-expression-context.query-handler';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '../../common/prisma/prisma.module';

const CommandHandlers = [
  CreateNoteCommandHandler,
  DeleteNoteCommandHandler,
  UpdateNoteContentCommandHandler,
  UpdateNoteTitleCommandHandler,
];

const QueryHandlers = [
  GetNoteQueryHandler,
  GetNotesForExpressionContextQueryHandler,
];

@Module({
  imports: [InfrastructureModule, CqrsModule, PrismaModule],
  providers: [NoteApiService, ...CommandHandlers, ...QueryHandlers],
  exports: [NoteApiService],
})
export class NoteModule {}
