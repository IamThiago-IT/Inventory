import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const exists = await this.prisma.product.findUnique({
      where: { sku: dto.sku },
    });
    if (exists) {
      throw new ConflictException(`Produto com SKU "${dto.sku}" já existe`);
    }
    return this.prisma.product.create({
      data: dto,
      include: { category: true, supplier: true },
    });
  }

  async findAll(search?: string) {
    return this.prisma.product.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { sku: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: { category: true, supplier: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        supplier: true,
        stockMovements: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });
    if (!product) {
      throw new NotFoundException(`Produto com ID "${id}" não encontrado`);
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: { category: true, supplier: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }

  async findLowStock() {
    return this.prisma.product.findMany({
      where: {
        quantity: { lte: this.prisma.product.fields?.minStock as any },
      },
      include: { category: true, supplier: true },
    });
  }

  async getLowStockProducts() {
    const products = await this.prisma.product.findMany({
      include: { category: true, supplier: true },
    });
    return products.filter((p) => p.quantity <= p.minStock);
  }
}
