import { Entity, Column, BaseEntity, PrimaryColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity({ name: 'documents' })
export class DbDocument extends BaseEntity {
  @ApiProperty({
    description: 'Document identifier',
    example: '40fd298e-0acb-4ef7-ac2e-d894a0cf74a3',
  })
  @PrimaryColumn()
  public document_id!: string;

  @ApiProperty({
    description: 'Document version',
    example: '1',
  })
  @Column({
    type: 'integer',
    nullable: false,
    default: 1,
  })
  public version_number: string;

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
}