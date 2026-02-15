import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
}

export class CreateStockMovementDto {
  @ApiProperty({ description: 'ID do produto' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ enum: MovementType, example: 'IN', description: 'Tipo: IN (entrada) ou OUT (saída)' })
  @IsEnum(MovementType)
  type: MovementType;

  @ApiProperty({ example: 50, description: 'Quantidade movimentada' })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({ example: 'Reposição de estoque do fornecedor', description: 'Motivo da movimentação' })
  @IsString()
  @IsOptional()
  reason?: string;
}
