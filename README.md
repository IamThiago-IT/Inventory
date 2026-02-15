# 📦 Sistema de Inventário

API REST para gerenciamento de inventário construída com **NestJS**, **Prisma** e **PostgreSQL**.

## Funcionalidades

- **Autenticação JWT** — Registro, login e controle de acesso por roles (ADMIN/USER)
- **CRUD de Produtos** — Nome, descrição, preço, SKU, quantidade, estoque mínimo
- **Categorias** — Organização dos produtos por categorias
- **Fornecedores** — Cadastro de fornecedores vinculados a produtos
- **Controle de Estoque** — Entradas/saídas com histórico completo
- **Swagger** — Documentação interativa da API

## Tecnologias

- [NestJS](https://nestjs.com/) v11
- [Prisma](https://www.prisma.io/) v7
- [PostgreSQL](https://www.postgresql.org/)
- [Passport JWT](http://www.passportjs.org/)
- [Swagger](https://swagger.io/)

## Pré-requisitos

- Node.js 18+
- PostgreSQL rodando localmente (ou via Docker)
- pnpm

## Setup Rápido

```bash
# 1. Clonar e instalar
git clone <repo-url>
cd Inventory
pnpm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com sua URL do PostgreSQL

# 3. Gerar Prisma Client
npx prisma generate

# 4. Rodar migrações
npx prisma migrate dev --name init

# 5. Popular banco com dados de exemplo
npx prisma db seed

# 6. Iniciar servidor
pnpm start:dev
```

Ou execute tudo de uma vez:
```bash
chmod +x setup.sh && ./setup.sh
```

## Acesso

| Recurso | URL |
|---------|-----|
| API | http://localhost:3000/api |
| Swagger Docs | http://localhost:3000/api/docs |

### Credenciais padrão (seed)
- **Email:** admin@inventory.com
- **Senha:** admin123

## Endpoints da API

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Registrar novo usuário |
| POST | `/api/auth/login` | Fazer login (retorna JWT) |
| GET | `/api/auth/profile` | Perfil do usuário autenticado 🔒 |

### Categorias 🔒
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/categories` | Criar categoria |
| GET | `/api/categories` | Listar categorias |
| GET | `/api/categories/:id` | Buscar por ID |
| PATCH | `/api/categories/:id` | Atualizar |
| DELETE | `/api/categories/:id` | Remover |

### Fornecedores 🔒
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/suppliers` | Cadastrar fornecedor |
| GET | `/api/suppliers` | Listar fornecedores |
| GET | `/api/suppliers/:id` | Buscar por ID |
| PATCH | `/api/suppliers/:id` | Atualizar |
| DELETE | `/api/suppliers/:id` | Remover |

### Produtos 🔒
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/products` | Criar produto |
| GET | `/api/products` | Listar (com busca via ?search=) |
| GET | `/api/products/low-stock` | Produtos com estoque baixo |
| GET | `/api/products/:id` | Buscar por ID |
| PATCH | `/api/products/:id` | Atualizar |
| DELETE | `/api/products/:id` | Remover |

### Estoque 🔒
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/stock/movement` | Registrar entrada/saída |
| GET | `/api/stock/movements` | Listar movimentações |
| GET | `/api/stock/movement/:id` | Buscar movimentação |
| GET | `/api/stock/history/:productId` | Histórico do produto |

> 🔒 = Requer token JWT no header `Authorization: Bearer <token>`

## Estrutura do Projeto

```
src/
├── auth/                  # Autenticação JWT
│   ├── decorators/        # @Roles, @CurrentUser
│   ├── dto/               # LoginDto, RegisterDto
│   ├── guards/            # JwtAuthGuard, RolesGuard
│   └── strategies/        # JwtStrategy
├── categories/            # CRUD de categorias
├── prisma/                # PrismaService (global)
├── products/              # CRUD de produtos
├── stock/                 # Controle de estoque
├── suppliers/             # CRUD de fornecedores
├── app.module.ts
└── main.ts
prisma/
├── schema.prisma          # Schema do banco de dados
└── seed.ts                # Dados iniciais
```

## Scripts Úteis

```bash
pnpm start:dev          # Iniciar em modo dev (hot reload)
pnpm build              # Build para produção
pnpm prisma:generate    # Regenerar Prisma Client
pnpm prisma:migrate     # Criar/rodar migrações
pnpm prisma:seed        # Popular banco
pnpm prisma:studio      # Abrir Prisma Studio (UI do banco)
```
