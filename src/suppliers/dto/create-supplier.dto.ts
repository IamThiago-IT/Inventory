import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({ example: 'Tech Supplies Ltda', description: 'Nome do fornecedor' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'contato@techsupplies.com', description: 'E-mail do fornecedor' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '(11) 99999-0000', description: 'Telefone do fornecedor' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Rua das Flores, 123 - São Paulo/SP', description: 'Endereço do fornecedor' })
  @IsString()
  @IsOptional()
  address?: string;
}
