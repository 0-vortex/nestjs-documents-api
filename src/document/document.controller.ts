import { Controller, Get, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { DbDocument } from './entities/document.entity';

@Controller('documents')
@ApiTags('Document service')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

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
}
