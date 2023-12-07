import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DbDocument } from './entities/document.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDocumentDto } from './dtos/create-document.dto';
import { DbDocumentVersion } from './entities/document_version.entity';
import { DbDocumentDraft } from './entities/document_draft.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(DbDocument, 'DbConnection')
    private documentRepository: Repository<DbDocument>,

    @InjectRepository(DbDocumentVersion, 'DbConnection')
    private documentVersionRepository: Repository<DbDocumentVersion>,

    @InjectRepository(DbDocumentDraft, 'DbConnection')
    private documentDraftRepository: Repository<DbDocumentDraft>,
  ) {}

  baseQueryBuilder() {
    const builder = this.documentRepository.createQueryBuilder('document');

    return builder;
  }

  async findOneById(id: string) {
    const queryBuilder = this.baseQueryBuilder()
      .loadRelationCountAndMap('document.versionsCount', 'document.documentVersions')
      .leftJoinAndMapOne(
        'document.lastVersion',
        'document.documentVersions',
        'document_version',
        'document_version.version_number = document.version_number',
      );

    queryBuilder.where('document.document_id = :id', { id });

    const item = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  async findOneByIdAndVersionId(id: string, versionId: string) {
    const queryBuilder = this.baseQueryBuilder()
      .loadRelationCountAndMap('document.versionsCount', 'document.documentVersions')
      .leftJoinAndMapOne(
        'document.lastVersion',
        'document.documentVersions',
        'document_version',
        'document_version.document_id = document.document_id',
      );

    queryBuilder.where('document.document_id = :id and document_version.document_version_id = :versionId', {
      id,
      versionId,
    });

    const item = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  async findOneByIdAndDraftId(id: string, draftId: string) {
    const queryBuilder = this.baseQueryBuilder()
      .loadRelationCountAndMap('document.versionsCount', 'document.documentVersions')
      .leftJoinAndMapOne(
        'document.lastVersion',
        'document.documentVersions',
        'document_version',
        'document_version.document_id = document.document_id',
      )
      .leftJoinAndMapOne(
        'document.draft',
        'document.documentDrafts',
        'document_draft',
        'document_draft.document_id = document.document_id and document_draft.document_version_id = document_version.document_version_id',
      );

    queryBuilder.where('document.document_id = :id and document_draft.document_draft_id = :draftId', {
      id,
      draftId,
    });

    const item = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  async deleteOneById(id: string) {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.withDeleted().addSelect('document.deleted_at').where('document.document_id = :id', { id });

    const itemExists = await queryBuilder.getOne();

    if (!itemExists) {
      throw new NotFoundException('Document not found');
    }

    if (itemExists.deleted_at) {
      throw new ConflictException('Document was already removed');
    }

    await this.documentRepository.softRemove(itemExists);

    return itemExists;
  }

  async createOne(createDocumentBody: CreateDocumentDto) {
    const itemDocument = await this.documentRepository.save({
      user_id: createDocumentBody.user_id,
    });

    if (!itemDocument) {
      throw new BadRequestException('Invalid document request');
    }

    const itemVersion = await this.documentVersionRepository.save({
      document_id: itemDocument.document_id,
      title: createDocumentBody.title,
      content: createDocumentBody.content,
      version_number: itemDocument.version_number,
      user_id: createDocumentBody.user_id,
    });

    if (!itemVersion) {
      throw new BadRequestException('Invalid version request');
    }

    itemDocument.lastVersion = itemVersion;

    return itemDocument;
  }

  async updateOneById(id: string, updateDocumentBody: CreateDocumentDto) {
    const itemExists = await this.findOneById(id);

    if (!itemExists) {
      throw new NotFoundException('Document not found');
    }

    const itemDraft = await this.documentDraftRepository.save({
      document_id: itemExists.document_id,
      document_version_id: itemExists.lastVersion.document_version_id,
      title: updateDocumentBody.title,
      content: updateDocumentBody.content,
      version_number: itemExists.lastVersion.version_number,
      user_id: updateDocumentBody.user_id,
    });

    if (!itemDraft) {
      throw new BadRequestException('Invalid draft request');
    }

    return itemDraft;
  }

  async publishOneByIdAndDraftId(id: string, draftId: string) {
    const itemExists = await this.findOneById(id);
    const itemDraftsExists = await this.findOneByIdAndDraftId(id, draftId);

    if (!itemExists || !itemDraftsExists) {
      throw new NotFoundException('Document not found');
    }

    console.log(itemExists);

    if (itemExists.lastVersion.document_version_id !== itemDraftsExists.draft.document_version_id) {
      throw new ConflictException('Document draft version mismatch');
    }

    itemExists.version_number = itemExists.version_number + 1;
    itemExists.versionsCount = itemExists.versionsCount + 1;
    const itemVersion = await this.documentVersionRepository.save({
      document_id: itemExists.document_id,
      title: itemExists.draft.title,
      content: itemExists.draft.content,
      version_number: itemExists.version_number,
      user_id: itemExists.draft.user_id,
    });
    await itemExists.save();

    itemExists.lastVersion = itemVersion;

    return itemExists;
  }
}
