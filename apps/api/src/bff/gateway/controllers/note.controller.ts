import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NoteApiService } from '../../../note/application/note-api.service';
import { CurrentUserId } from '../auth/current-user-id.decorator';
import { CreateNoteDto } from '../dtos/create-note.dto';
import { UpdateNoteContentDto } from '../dtos/update-note-content.dto';
import { UpdateNoteTitleDto } from '../dtos/update-note-title.dto';
import { GetNoteListQueryDto } from '../dtos/get-note-list-query.dto';

@UseGuards(ClerkAuthGuard)
@ApiTags('App - Notes')
@Controller('note')
export class NoteController {
  constructor(private readonly noteApiService: NoteApiService) {}

  @ApiBearerAuth('app-auth')
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The note has been successfully created.',
    schema: {
      type: 'object',
      properties: {
        noteId: { type: 'string', format: 'uuid' },
      },
    },
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createNote(
    @CurrentUserId() userId: string,
    @Body() dto: CreateNoteDto,
  ) {
    return await this.noteApiService.createNote(
      dto.expressionContextId,
      userId,
      dto.title,
    );
  }

  @ApiBearerAuth('app-auth')
  @ApiOperation({ summary: 'Update note content' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The note content has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Note not found or user is not the owner.',
  })
  @Patch(':noteId/content')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateNoteContent(
    @CurrentUserId() userId: string,
    @Param('noteId', new ParseUUIDPipe()) noteId: string,
    @Body() dto: UpdateNoteContentDto,
  ) {
    await this.noteApiService.updateNoteContent(noteId, userId, dto.content);
  }

  @ApiBearerAuth('app-auth')
  @ApiOperation({ summary: 'Update note title' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The note title has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Note not found or user is not the owner.',
  })
  @Patch(':noteId/title')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateNoteTitle(
    @CurrentUserId() userId: string,
    @Param('noteId', new ParseUUIDPipe()) noteId: string,
    @Body() dto: UpdateNoteTitleDto,
  ) {
    await this.noteApiService.updateNoteTitle(noteId, userId, dto.title);
  }

  @ApiBearerAuth('app-auth')
  @ApiOperation({ summary: 'Get a note by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the note',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        expressionContextId: { type: 'string', format: 'uuid' },
        userId: { type: 'string' },
        title: { type: 'string' },
        content: { type: 'string', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Note not found or user is not the owner.',
  })
  @Get(':noteId')
  async getNote(
    @CurrentUserId() userId: string,
    @Param('noteId', new ParseUUIDPipe()) noteId: string,
  ) {
    return await this.noteApiService.getNote(noteId, userId);
  }

  @ApiBearerAuth('app-auth')
  @ApiOperation({ summary: 'Get notes for expression context' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a list of notes for the expression context',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              expressionContextId: { type: 'string', format: 'uuid' },
              userId: { type: 'string' },
              title: { type: 'string' },
              content: { type: 'string', nullable: true },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        total: { type: 'number' },
        currentPage: { type: 'number' },
      },
    },
  })
  @Get('expression-context/:expressionContextId')
  async getNotesForExpressionContext(
    @Param('expressionContextId', new ParseUUIDPipe())
    expressionContextId: string,
    @Query() query: GetNoteListQueryDto,
  ) {
    return await this.noteApiService.getNotesForExpressionContext(
      expressionContextId,
      query.take,
      query.page,
    );
  }
}
