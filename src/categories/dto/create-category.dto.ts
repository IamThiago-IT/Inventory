import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Eletrônicos', description: 'Nome da categoria' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Produtos eletrônicos em geral',
    description: 'Descrição da categoria',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
