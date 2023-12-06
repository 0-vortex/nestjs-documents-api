import { Module } from '@nestjs/common';
import { DbDocument } from './entities/document.entity';
import { DbDocumentDraft } from './entities/document_draft.entity';
import { DbDocumentVersion } from './entities/document_version.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DbDocument, DbDocumentDraft, DbDocumentVersion], 'DbConnection')],
  providers: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
