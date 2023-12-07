import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DbDocument } from './document.entity';
import { JoinColumn } from 'typeorm';

@Entity({ name: 'document_versions' })
export class DbDocumentVersion extends BaseEntity {
  @ApiProperty({
    description: 'Document version identifier',
    example: '40fd298e-0acb-4ef7-ac2e-d894a0cf74a3',
  })
  @PrimaryGeneratedColumn('uuid')
  public document_version_id!: string;

  @ApiProperty({
    description: 'Linked document identifier',
    example: '40fd298e-0acb-4ef7-ac2e-d894a0cf74a3',
  })
  @Column({
    type: 'uuid',
    nullable: false,
    select: false,
  })
  public document_id!: string;

  @ApiProperty({
    description: 'Author identifier',
    example: 57568598,
  })
  @Column({
    type: 'integer',
  })
  public user_id: number;

  @ApiProperty({
    description: 'Version identifier',
    example: '1',
  })
  @Column({
    type: 'integer',
    nullable: false,
    default: 1,
  })
  public version_number: number;

  @ApiProperty({
    description: 'Document title',
    example: 'Document Title',
  })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  public title: string;

  @ApiProperty({
    description: 'Document content',
    example: 'This is document content.',
  })
  @Column({
    type: 'text',
    nullable: false,
  })
  public content: string;

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
  @ManyToOne(() => DbDocument, (document) => document.documentVersions)
  @JoinColumn({
    name: 'document_id',
    referencedColumnName: 'document_id',
  })
  public document!: DbDocument;
}
