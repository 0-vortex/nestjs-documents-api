import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { DbDocument } from './entities/document.entity';
import { DbDocumentVersion } from './entities/document_version.entity';
import { DbDocumentDraft } from './entities/document_draft.entity';
import { CreateDocumentDto } from './dtos/create-document.dto';

@Controller('documents')
@ApiTags('Document service')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('/')
  @ApiOperation({
    operationId: 'createOne',
    summary: 'Creates a document',
  })
  @ApiOkResponse({ type: DbDocument })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  @ApiBody({ type: CreateDocumentDto })
  async createOne(@Body() createDocumentBody: CreateDocumentDto): Promise<DbDocument> {
    return this.documentService.createOne(createDocumentBody);
  }

  @Get('/:id')
  @ApiOperation({
    operationId: 'findOneById',
    summary: 'Finds a document by :id',
  })
  @ApiOkResponse({ type: DbDocument })
  @ApiNotFoundResponse({ description: 'Document not found' })
  async findOneById(@Param('id') id: string): Promise<DbDocument> {
    return this.documentService.findOneById(id);
  }

  @Delete('/:id')
  @ApiOperation({
    operationId: 'deleteOneById',
    summary: 'Deletes a document by :id',
  })
  @ApiOkResponse({ type: DbDocument })
  @ApiNotFoundResponse({ description: 'Document not found' })
  @ApiConflictResponse({ description: 'Document was already removed' })
  async deleteOneById(@Param('id') id: string): Promise<DbDocument> {
    return this.documentService.deleteOneById(id);
  }

  @Patch('/:id')
  @ApiOperation({
    operationId: 'updateOneById',
    summary: 'Updates a document by :id',
  })
  @ApiOkResponse({ type: DbDocumentDraft })
  @ApiNotFoundResponse({ description: 'Document not found' })
  async updateOneById(
    @Param('id') id: string,
    @Body() updateDocumentBody: CreateDocumentDto,
  ): Promise<DbDocumentDraft> {
    return this.documentService.updateOneById(id, updateDocumentBody);
  }

  @Get('/:id/version/:versionId')
  @ApiOperation({
    operationId: 'findOneByIdAndVersionId',
    summary: 'Finds a document version by :id and :versionId',
  })
  @ApiOkResponse({ type: DbDocumentVersion })
  @ApiNotFoundResponse({ description: 'Document version not found' })
  async findOneByIdAndVersionId(@Param('id') id: string, @Param('versionId') versionId: string): Promise<DbDocument> {
    return this.documentService.findOneByIdAndVersionId(id, versionId);
  }

  @Get('/:id/draft/:draftId')
  @ApiOperation({
    operationId: 'findOneByIdAndDraftId',
    summary: 'Finds a document draft by :id and :draftId',
  })
  @ApiOkResponse({ type: DbDocumentDraft })
  @ApiNotFoundResponse({ description: 'Document draft not found' })
  async findOneByIdAndDraftId(@Param('id') id: string, @Param('draftId') draftId: string): Promise<DbDocument> {
    return this.documentService.findOneByIdAndDraftId(id, draftId);
  }

  @Post('/:id/draft/:draftId/publish')
  @ApiOperation({
    operationId: 'publishOneByIdAndDraftId',
    summary: 'Publishes a document draft by :id and :draftId',
  })
  @ApiOkResponse({ type: DbDocument })
  @ApiNotFoundResponse({ description: 'Document draft not found' })
  @ApiConflictResponse({ description: 'Document draft version mismatch' })
  @ApiConflictResponse({ description: 'Document draft was already published' })
  async publishOneByIdAndDraftId(@Param('id') id: string, @Param('draftId') draftId: string): Promise<DbDocument> {
    return this.documentService.publishOneByIdAndDraftId(id, draftId);
  }

  @Put('/:id/draft/:draftId/publish')
  @ApiOperation({
    operationId: 'publishOneByIdAndDraftIdForced',
    summary: 'Publishes a document draft by :id and :draftId forcefully',
  })
  @ApiOkResponse({ type: DbDocument })
  @ApiNotFoundResponse({ description: 'Document draft not found' })
  @ApiConflictResponse({ description: 'Document draft was already published' })
  async publishOneByIdAndDraftIdForced(
    @Param('id') id: string,
    @Param('draftId') draftId: string,
  ): Promise<DbDocument> {
    return this.documentService.publishOneByIdAndDraftId(id, draftId, true);
  }
}
