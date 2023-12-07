import {
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DbDocumentVersion } from './document_version.entity';
import { DbDocumentDraft } from './document_draft.entity';

@Entity({ name: 'documents' })
export class DbDocument extends BaseEntity {
  @ApiProperty({
    description: 'Document identifier',
    example: '40fd298e-0acb-4ef7-ac2e-d894a0cf74a3',
  })
  @PrimaryGeneratedColumn('uuid')
  public document_id: string;

  @ApiProperty({
    description: 'Document version',
    example: '1',
  })
  @Column({
    type: 'integer',
    nullable: false,
    default: 1,
  })
  public version_number: number;

  @ApiProperty({
    description: 'Author identifier',
    example: 57568598,
  })
  @Column({
    type: 'integer',
  })
  public user_id: number;

  @ApiPropertyOptional({
    description: 'Timestamp representing user creation',
    example: '2016-10-19 13:24:51.000000',
  })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'now()',
  })
  public created_at?: Date;

  @ApiHideProperty()
  @DeleteDateColumn({
    type: 'timestamp',
    select: false,
  })
  public deleted_at?: Date;

  @ApiHideProperty()
  @OneToMany(() => DbDocumentVersion, (documentVersion) => documentVersion.document)
  public documentVersions: DbDocumentVersion[];

  @ApiHideProperty()
  @OneToMany(() => DbDocumentDraft, (documentDraft) => documentDraft.document)
  public documentDrafts: DbDocumentDraft[];

  @ApiProperty({
    description: 'Document version data',
  })
  public lastVersion: DbDocumentVersion;

  @ApiProperty({
    description: 'Document draft data',
  })
  public draft!: DbDocumentDraft;

  @ApiProperty({
    description: 'Number of document versions',
    example: 2,
  })
  public versionsCount: number;
}
