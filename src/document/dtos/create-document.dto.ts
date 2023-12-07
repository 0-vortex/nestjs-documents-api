import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsNumber } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({
    description: 'Document title',
    example: 'API created document',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Document content',
    example: 'API created content.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Author identifier',
    example: 57568598,
  })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
