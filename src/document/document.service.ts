import { Injectable, NotFoundException } from '@nestjs/common';
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
}
