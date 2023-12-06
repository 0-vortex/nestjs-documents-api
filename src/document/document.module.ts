import { Module } from '@nestjs/common';
import { DbDocument } from './entities/document.entity';
import { DbDocumentDraft } from './entities/document_draft.entity';
import { DbDocumentVersion } from './entities/document_version.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DbDocument, DbDocumentDraft, DbDocumentVersion], 'DbConnection')],
})
export class DocumentModule {}
