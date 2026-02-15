#!/bin/bash

echo "🚀 Configurando o Sistema de Inventário..."
echo ""

# Instalar dependências
echo "📦 Instalando dependências..."
pnpm install

# Aprovar builds do Prisma
echo "✅ Aprovando builds..."
pnpm approve-builds 2>/dev/null || true

# Instalar tipos dev
echo "📦 Instalando tipos de desenvolvimento..."
pnpm add -D @types/passport-jwt @types/bcryptjs

# Gerar Prisma Client
echo "🔧 Gerando Prisma Client..."
npx prisma generate

# Executar migrações
echo "🗃️  Executando migrações do banco de dados..."
npx prisma migrate dev --name init

# Executar seed
echo "🌱 Populando banco de dados..."
npx prisma db seed

echo ""
echo "✅ Setup concluído!"
echo ""
echo "Para iniciar o servidor:"
echo "  pnpm start:dev"
echo ""
echo "Swagger disponível em: http://localhost:3000/api/docs"
echo ""
echo "Credenciais padrão:"
echo "  Email: admin@inventory.com"
echo "  Senha: admin123"
