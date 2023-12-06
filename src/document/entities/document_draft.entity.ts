import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity({ name: 'document_drafts' })
export class DbDocumentDraft extends BaseEntity {
  @ApiProperty({
    description: 'Document draft identifier',
    example: '40fd298e-0acb-4ef7-ac2e-d894a0cf74a3',
  })
  @PrimaryGeneratedColumn()
  public document_draft_id!: string;

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
    description: 'Linked document version identifier',
    example: '40fd298e-0acb-4ef7-ac2e-d894a0cf74a3',
  })
  @Column({
    type: 'uuid',
    nullable: false,
    select: false,
  })
  public document_version_id!: string;

  @ApiProperty({
    description: 'Author identifier',
    example: 57568598,
  })
  @Column({
    type: 'integer',
    select: false,
  })
  public user_id!: number;

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
}