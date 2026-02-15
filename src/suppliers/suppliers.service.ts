import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSupplierDto) {
    if (dto.email) {
      const exists = await this.prisma.supplier.findUnique({
        where: { email: dto.email },
      });
      if (exists) {
        throw new ConflictException(`Fornecedor com e-mail "${dto.email}" já existe`);
      }
    }
    return this.prisma.supplier.create({ data: dto });
  }

  async findAll() {
    return this.prisma.supplier.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
      include: { products: true },
    });
    if (!supplier) {
      throw new NotFoundException(`Fornecedor com ID "${id}" não encontrado`);
    }
    return supplier;
  }

  async update(id: string, dto: UpdateSupplierDto) {
    await this.findOne(id);
    return this.prisma.supplier.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.supplier.delete({ where: { id } });
  }
}
