import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) {}

  async createMovement(dto: CreateStockMovementDto, userId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException(`Produto com ID "${dto.productId}" não encontrado`);
    }

    if (dto.type === 'OUT' && product.quantity < dto.quantity) {
      throw new BadRequestException(
        `Estoque insuficiente. Disponível: ${product.quantity}, Solicitado: ${dto.quantity}`,
      );
    }

    const newQuantity =
      dto.type === 'IN'
        ? product.quantity + dto.quantity
        : product.quantity - dto.quantity;

    const [movement] = await this.prisma.$transaction([
      this.prisma.stockMovement.create({
        data: {
          type: dto.type,
          quantity: dto.quantity,
          reason: dto.reason,
          productId: dto.productId,
          userId,
        },
        include: {
          product: { select: { id: true, name: true, sku: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.product.update({
        where: { id: dto.productId },
        data: { quantity: newQuantity },
      }),
    ]);

    return {
      ...movement,
      previousQuantity: product.quantity,
      newQuantity,
    };
  }

  async findAll(productId?: string) {
    return this.prisma.stockMovement.findMany({
      where: productId ? { productId } : undefined,
      include: {
        product: { select: { id: true, name: true, sku: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const movement = await this.prisma.stockMovement.findUnique({
      where: { id },
      include: {
        product: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
    if (!movement) {
      throw new NotFoundException(`Movimentação com ID "${id}" não encontrada`);
    }
    return movement;
  }

  async getProductHistory(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Produto com ID "${productId}" não encontrado`);
    }

    const movements = await this.prisma.stockMovement.findMany({
      where: { productId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      product: {
        id: product.id,
        name: product.name,
        sku: product.sku,
        currentQuantity: product.quantity,
      },
      movements,
      totalIn: movements
        .filter((m) => m.type === 'IN')
        .reduce((sum, m) => sum + m.quantity, 0),
      totalOut: movements
        .filter((m) => m.type === 'OUT')
        .reduce((sum, m) => sum + m.quantity, 0),
    };
  }
}
