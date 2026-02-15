import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Teclado Mecânico RGB', description: 'Nome do produto' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Teclado mecânico com switches blue e iluminação RGB',
    description: 'Descrição do produto',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'TEC-MEC-001', description: 'Código SKU único do produto' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 299.9, description: 'Preço do produto' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 100, description: 'Quantidade inicial em estoque' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({ example: 10, description: 'Estoque mínimo para alerta' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  minStock?: number;

  @ApiPropertyOptional({ description: 'ID da categoria' })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'ID do fornecedor' })
  @IsUUID()
  @IsOptional()
  supplierId?: string;
}
