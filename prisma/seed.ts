import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@inventory.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@inventory.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log(`✅ Usuário admin criado: ${admin.email}`);

  // Criar categorias
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Eletrônicos' },
      update: {},
      create: { name: 'Eletrônicos', description: 'Produtos eletrônicos em geral' },
    }),
    prisma.category.upsert({
      where: { name: 'Periféricos' },
      update: {},
      create: { name: 'Periféricos', description: 'Teclados, mouses, headsets, etc.' },
    }),
    prisma.category.upsert({
      where: { name: 'Componentes' },
      update: {},
      create: { name: 'Componentes', description: 'Placas, memórias, processadores, etc.' },
    }),
  ]);
  console.log(`✅ ${categories.length} categorias criadas`);

  // Criar fornecedores
  const suppliers = await Promise.all([
    prisma.supplier.upsert({
      where: { email: 'contato@techsupplies.com' },
      update: {},
      create: {
        name: 'Tech Supplies Ltda',
        email: 'contato@techsupplies.com',
        phone: '(11) 99999-0001',
        address: 'Rua da Tecnologia, 100 - São Paulo/SP',
      },
    }),
    prisma.supplier.upsert({
      where: { email: 'vendas@megahardware.com' },
      update: {},
      create: {
        name: 'Mega Hardware',
        email: 'vendas@megahardware.com',
        phone: '(21) 88888-0002',
        address: 'Av. dos Computadores, 500 - Rio de Janeiro/RJ',
      },
    }),
  ]);
  console.log(`✅ ${suppliers.length} fornecedores criados`);

  // Criar produtos
  const products = await Promise.all([
    prisma.product.upsert({
      where: { sku: 'TEC-MEC-001' },
      update: {},
      create: {
        name: 'Teclado Mecânico RGB',
        description: 'Teclado mecânico com switches blue e iluminação RGB',
        sku: 'TEC-MEC-001',
        price: 299.90,
        quantity: 50,
        minStock: 10,
        categoryId: categories[1].id,
        supplierId: suppliers[0].id,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'MOU-GAM-001' },
      update: {},
      create: {
        name: 'Mouse Gamer 16000 DPI',
        description: 'Mouse gamer com sensor óptico de alta precisão',
        sku: 'MOU-GAM-001',
        price: 189.90,
        quantity: 30,
        minStock: 5,
        categoryId: categories[1].id,
        supplierId: suppliers[0].id,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'SSD-NVM-001' },
      update: {},
      create: {
        name: 'SSD NVMe 1TB',
        description: 'SSD NVMe M.2 de alto desempenho',
        sku: 'SSD-NVM-001',
        price: 449.90,
        quantity: 3,
        minStock: 5,
        categoryId: categories[2].id,
        supplierId: suppliers[1].id,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'MON-4K-001' },
      update: {},
      create: {
        name: 'Monitor 4K 27"',
        description: 'Monitor IPS 4K UHD com HDR',
        sku: 'MON-4K-001',
        price: 1899.90,
        quantity: 8,
        minStock: 3,
        categoryId: categories[0].id,
        supplierId: suppliers[1].id,
      },
    }),
  ]);
  console.log(`✅ ${products.length} produtos criados`);

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📋 Credenciais de acesso:');
  console.log('   Email: admin@inventory.com');
  console.log('   Senha: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
