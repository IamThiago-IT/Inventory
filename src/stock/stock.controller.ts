import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { StockService } from './stock.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Estoque')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('movement')
  @ApiOperation({ summary: 'Registrar movimentação de estoque (entrada/saída)' })
  @ApiResponse({ status: 201, description: 'Movimentação registrada com sucesso' })
  createMovement(@Body() dto: CreateStockMovementDto, @Request() req: any) {
    return this.stockService.createMovement(dto, req.user.id);
  }

  @Get('movements')
  @ApiOperation({ summary: 'Listar todas as movimentações' })
  @ApiQuery({ name: 'productId', required: false, description: 'Filtrar por produto' })
  findAll(@Query('productId') productId?: string) {
    return this.stockService.findAll(productId);
  }

  @Get('movement/:id')
  @ApiOperation({ summary: 'Buscar movimentação por ID' })
  findOne(@Param('id') id: string) {
    return this.stockService.findOne(id);
  }

  @Get('history/:productId')
  @ApiOperation({ summary: 'Histórico de movimentações de um produto' })
  getProductHistory(@Param('productId') productId: string) {
    return this.stockService.getProductHistory(productId);
  }
}
