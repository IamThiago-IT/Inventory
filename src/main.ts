import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // CORS
  app.enableCors();

  // Prefixo global da API
  app.setGlobalPrefix('api');

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Sistema de Inventário')
    .setDescription(
      'API para gerenciamento de inventário com controle de produtos, categorias, fornecedores e estoque',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Autenticação', 'Registro e login de usuários')
    .addTag('Categorias', 'Gerenciamento de categorias de produtos')
    .addTag('Fornecedores', 'Gerenciamento de fornecedores')
    .addTag('Produtos', 'CRUD de produtos')
    .addTag('Estoque', 'Movimentações de entrada e saída de estoque')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
  console.log(`📚 Swagger disponível em http://localhost:${port}/api/docs`);
}
bootstrap();
