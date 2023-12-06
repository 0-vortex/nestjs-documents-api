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
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where('document.document_id = :id', { id });

    const item = await queryBuilder.getOne();

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }
}
