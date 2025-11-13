import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || '*',
    credentials: true,
  });

  // API prefix
  app.setGlobalPrefix(process.env.API_PREFIX || 'api/v1');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Book.ax Location Service API')
    .setDescription('Worldwide location database for hotel search - countries, cities, districts, POIs')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Locations', 'Public location search endpoints')
    .addTag('Admin - Locations', 'Admin endpoints for managing locations (requires authentication)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`
    🚀 Book.ax Location Service is running!
    
    📍 API:     http://localhost:${port}/${process.env.API_PREFIX || 'api/v1'}
    📚 Docs:    http://localhost:${port}/docs
    🗄️  Database: ${process.env.DATABASE_URL ? '✅ Connected' : '❌ Not configured'}
  `);
}

bootstrap();
