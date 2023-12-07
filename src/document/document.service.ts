import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DbDocument } from './entities/document.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(DbDocument, 'DbConnection')
    private documentRepository: Repository<DbDocument>,
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
}
